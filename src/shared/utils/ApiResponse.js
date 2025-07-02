class ApiResponse {
    constructor(statusCode, data, message="Success", meta=null){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;

        if(meta){
            this.meta = meta;
        }
    }
}

export {ApiResponse};


// meta property use:
/*
const users = await User.find().limit(10).skip(0); // pagination logic

const meta = {
  page: 1,
  limit: 10,
  total: 125,
  totalPages: 13,
  requestId: req.id, // if you're attaching a request ID per request
};

return res
  .status(200)
  .json(new ApiResponse(200, users, "Fetched users successfully", meta));
  
*/