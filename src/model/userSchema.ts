import dynamoose from "dynamoose";

const userSchema = new dynamoose.Schema({
  userId: {
    type: String,
    hashKey: true, // Partition key
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: String, // Date of birth in string format (e.g., "YYYY-MM-DD")
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(), // Default to current date
  }
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
});
export const User = dynamoose.model("User", userSchema);