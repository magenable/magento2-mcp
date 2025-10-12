# Magento 2 MCP Server

This is a Model Context Protocol (MCP) server that connects to a Magento 2 REST API, allowing Claude and other MCP clients to query product information from a Magento store.
It is a fork of https://github.com/boldcommerce/magento2-mcp with added support of HTTP connection to MCP server, so now it can be used with remote clients like OpenAI Agent Builder

## For quick start:
- in root dir run `npm install`
- create `.env` file based on `.env.sample`
- run `npm run start:http` or `npm run start:stdio`

After starting the HTTP server, a JWT token will be generated in the console for use in the auth header in MCP client.

`Authorization: Bearer <token>`

By default, the server address is http://localhost:3000/mcp

You can generate new token with command `npm run jwt:genearte username`

## How to connect with OpenAi Agent Builder MCP

### 1. deploy app
- `git clone git@github.com:magenable/magento2-mcp.git`
- `cd magento2-mcp`
- `npm install`
- `cp .env.sample .env`
- fill .env file:

  `MAGENTO_BASE_URL`=Magento REST API URL like https://example.com/rest/default/V1

  `MAGENTO_API_TOKEN`= Admin token or Integration token
    
    *Admin token* - can be obtained via REST API https://example.com/rest/default/V1integration/admin/token. Has a default expiration time of 4 hours
    *Integration token* - can be created on Login to Admin -> System -> Extensions -> Integrations 

  `JWT_SECRET_KEY`= any random string. need for generate token and verify it

  `PORT`=3000
- `npn run jwt:generate username` - Generate jwt token which is needed for the authorization bearer header (Authorization: Bearer 'TOKEN')

- `npm run start:http` or you can use [pm2](https://pm2.keymetrics.io/)

The server has started. At startup, a JWT token will be automatically generated and displayed in the console.

OpenAi need HTTPS connection and domain. You can use NGINX as a reverse proxy and install a certificate, for example, via certbot

### 2. OpenAi Agent Builder
- Login to platform.openai.com
- Go to https://platform.openai.com/agent-builder
- Edit Workflow
- Add MCP workflow module
- Add server
- Fill data

  `URL` - https://example.com/mcp

  `Authentication` - Access token / API key

  `Add your access token` - JWT token from point 1


## Features

### Product Features
- Query product information by SKU or ID
- Search for products using various criteria
- Get product categories
- Get related products
- Get product stock information
- Get product attributes
- Update product attributes by specifying attribute code and value
- Advanced product search with filtering and sorting

### Customer Features
- Get all ordered products for a customer by email address

### Order and Revenue Features
- Get order count for specific date ranges
- Get revenue for specific date ranges
- Get revenue filtered by country for specific date ranges
- Get product sales statistics including quantity sold and top-selling products
- Support for relative date expressions like "today", "yesterday", "last week", "this month", "YTD"
- Support for country filtering using both country codes and country names

## Prerequisites

- Node.js (v14 or higher)
- A Magento 2 instance with REST API access
- API token for the Magento 2 instance


## Usage

### Running the server directly

```bash
npm run start:stdio
```

### Testing with the test client

```bash
node test-mcp-server.js
```

### Using with Claude Desktop

1. Check your path node with `which node`
2. Go to the Developer settings and click "Edit config". This will open a JSON file.
3. Add the following snippet within the `mcpServers`:

```
    "magento2": {
      "command": "/path/to/your/node",
      "args": ["/path/to/mcp-server.js"],
      "env": {
        "MAGENTO_BASE_URL": "https://YOUR_DOMAIN/rest/V1",
        "MAGENTO_API_TOKEN": "your-api-token"
      }
    }
```

3. Replace `/path/to/your/node` with the path you checked in step 1
4. Replace `/path/to/mcp-server.js` with the path where you cloned this repo
5. You can get an API token from System > Integrations in the Magento admin
6. Restart Claude Desktop.
7. You should now be able to ask Claude questions about products in your Magento store.

## Available Tools

The server exposes the following tools:

### Product Tools
- `get_product_by_sku`: Get detailed information about a product by its SKU
- `search_products`: Search for products using Magento search criteria
- `get_product_categories`: Get categories for a specific product by SKU
- `get_related_products`: Get products related to a specific product by SKU
- `get_product_stock`: Get stock information for a product by SKU
- `get_product_attributes`: Get all attributes for a product by SKU
- `get_product_by_id`: Get detailed information about a product by its ID
- `advanced_product_search`: Search for products with advanced filtering options
- `update_product_attribute`: Update a specific attribute of a product by SKU

### Customer Tools
- `get_customer_ordered_products_by_email`: Get all ordered products for a customer by email address

### Order and Revenue Tools
- `get_order_count`: Get the number of orders for a given date range
- `get_revenue`: Get the total revenue for a given date range
- `get_revenue_by_country`: Get revenue filtered by country for a given date range
- `get_product_sales`: Get statistics about the quantity of products sold in a given date range

## Example Queries for Claude

Once the MCP server is connected to Claude Desktop, you can ask questions like:

### Product Queries
- "What products do you have that are shirts?"
- "Tell me about product with SKU SKU-xxx"
- "What categories does product SKU-xxx belong to?"
- "Are there any related products to SKU-SKU-xxx?"
- "What's the stock status of product SKU-xxx?"
- "Show me all products sorted by price"
- "Update the price of product SKU-xxx to $49.99"
- "Change the description of product ABC-123 to describe it as water-resistant"
- "Set the status of product XYZ-456 to 'enabled'"

### Customer Queries
- "What products has customer john.doe@example.com ordered?"
- "Show me the order history and products for customer with email jane.smith@example.com"

### Order and Revenue Queries
- "How many orders do we have today?"
- "What's our order count for last week?"
- "How much revenue did we generate yesterday?"
- "What was our total revenue last month?"
- "How much revenue did we make in The Netherlands this year to date?"
- "What's our revenue in Germany for the last week?"
- "Compare our revenue between the US and Canada for this month"
- "What's our average order value for completed orders this month?"
- "How many products did we sell last month?"
- "What are our top-selling products this year?"
- "What's the average number of products per order?"
- "How many units of product XYZ-123 did we sell in Germany last quarter?"
- "Which products generated the most revenue in the US this month?"


## Development

### SSL Certificate Verification

For development purposes, the server is configured to bypass SSL certificate verification. In a production environment, you should use proper SSL certificates and remove the `httpsAgent` configuration from the `callMagentoApi` function.

### Adding New Tools

To add new tools, follow the pattern in the existing code. Each tool is defined with:

1. A unique name
2. A description
3. Input parameters with validation using Zod
4. An async handler function that processes the request and returns a response

## License

ISC

### Need further support, help or custom implementation?

Contact Magenable- [h](https://magenable.com.au)
Experts in eCommerce and AI.
