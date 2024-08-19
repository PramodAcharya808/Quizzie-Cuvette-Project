class ApiResponse {
  constructor(statusCode, message = "SUCCESS", data) {
    this.status = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
