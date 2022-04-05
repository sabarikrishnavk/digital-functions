// with thanks to https://github.com/vnovick/netlify-function-example/blob/master/functions/bad-words.js
const axios = require('axios')

const query = ` 
mutation UpdateCart($cartid: uuid!, $discount: numeric!, $total: numeric!, $tax: numeric!, $shipping: numeric!, $productprice: numeric! ,$status: Int!) {
  update_trolley_cart(where: {cartid: {_eq: $cartid}}, _set: {discount: $discount, total: $total, tax: $tax, shipping: $shipping, productprice: $productprice, status: $status}) {
    affected_rows
    returning {
      shipping
      productprice
      discount
      tax
      total
      status
    }
  }
} 
`

const handler = async (cart) => {
  let request
  try {
    request = JSON.parse(cart.body)
  } catch {
    return { statusCode: 400, body: 'cannot parse hasura event' }
  }

  const variables = {
    "cartid" : request.cartid,//"b16b1937-4356-4eaf-9a9f-311508eb2179"  ,
    "discount": "20.0",
    "total": "200", 
    "tax": "5",
    "shipping": "10", 
    "productprice": "95",
    "status": "1"
  } 
  try {

    const hasuraendpoint ="https://digital-qa-graphql.hasura.app/v1/graphql";
    const adminsecret = "k5IF0IfYkKDg2091RjfVyB4JVUqE4CkMEh1Rh76djjBjiSB8wZVj26Y4Qjp9fHWY";
     
    const headers = {
      "content-type": "application/json",
      "x-hasura-admin-secret": `${adminsecret}`,
    };
    const graphqlQuery = {
        "operationName": "UpdateCart",
        "query": query,
        "variables": variables
    };
    
    const response = await axios({
      url: hasuraendpoint,
      method: 'post',
      headers: headers,
      data: graphqlQuery
    });
    
    console.log(response.data); // data
    console.log(response.errors); // errors if any
 
    return { statusCode: 200, body: 'success' }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
