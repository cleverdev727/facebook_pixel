export const CUSTOMER_ACCESS_TOKEN_CREATE = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    userErrors {
      field
      message
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
  }
}`

export const CUSTOMER_ACCESS_TOKEN_CREATE_WITH_MULTIPASS = `mutation customerAccessTokenCreateWithMultipass($multipassToken: String!) {
  customerAccessTokenCreateWithMultipass(multipassToken: $multipassToken) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`

export const CUSTOMER_ACCESS_TOKEN_RENEW = `mutation customerAccessTokenRenew($customerAccessToken: String!) {
  customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    userErrors {
      field
      message
    }
  }
}`

export const CUSTOMER_ACCESS_TOKEN_DELETE = `mutation customerAccessTokenDelete($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    deletedAccessToken
    deletedCustomerAccessTokenId
    userErrors {
      field
      message
    }
  }
}`

export const GET_CUSTOMER = `query getCustomer($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    email
    acceptsMarketing
    createdAt
    updatedAt
    displayName
    lastName
    firstName
    phone
    tags
  }
}`

export const CUSTOMER_CREATE = `mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      firstName
      lastName
      email
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`

export const CUSTOMER_RECOVER = `mutation customerRecover($email: String!) {
  customerRecover(email: $email) {
    customerUserErrors {
      code
      field
      message
    }
  }
}`

export const CUSTOMER_RESET = `mutation customerReset($id: ID!, $input: CustomerResetInput!) {
  customerReset(id: $id, input: $input) {
    customer {
      id
      email
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`
