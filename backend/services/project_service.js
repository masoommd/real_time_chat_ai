import mongoose from "mongoose";
import Project from "../models/project_models.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("User is required");
  }
  let project;
  try {
    project = await Project.create({
      name,
      users: [userId],
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("Project name must be unique");
    }
    throw err;
    console.log(err.message);
  }
  return project;
};

export const getAllProjectByUser = async ({ userId }) => {
  if (!userId) {
    throw new Error("User is required");
  }
  let allUserProjects;
  try {
    allUserProjects = await Project.find({ users: userId });
  } catch (err) {
    throw err;
    console.log(err.message);
  }
  return allUserProjects;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("Project Id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  if (!users) {
    throw new Error("Users is required");
  }

  if (!Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId(s) in users array");
  }

  if (!userId) {
    throw new Error("User Id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User Id");
  }

  const project = await Project.findOne({
    _id: projectId,
    users: userId,
  });

  if(!project){
    throw new Error('User is not belong to this project');
  }

  const updatedProject = await Project.findOneAndUpdate({
    _id:projectId,
  },{
    $addToSet:{
        users:{
            $each: users
        }
    }
  },{new:true})

  return updatedProject;

};


export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project Id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  const project = await Project.findById(projectId)
    .populate('users') 
    .populate({
      path: 'messages.sender', 
      model: 'User',
      select: '_id email', 
    })

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export const updateFileTree = async ({projectId, fileTree}) => {
    if (!projectId) {
    throw new Error("Project Id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  if(!fileTree){
    throw new Error('File tree is required')
  }

  const project = await Project.findOneAndUpdate({
    _id:projectId,
  },{
    fileTree
  },{
    new:true
  })

return project;
}

export const addMessageToProject = async ({ projectId, message, sender }) => {
  if (!projectId) {
    throw new Error("Project Id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  if (!message || !sender) {
    throw new Error("Message and sender are required");
  }

  const updatedProject = await Project.findOneAndUpdate(
    { _id: projectId },
    {
      $push: {
        messages: {
          message,
          sender,
          timestamp: new Date(), 
        },
      },
    },
    { new: true }
  );

  return updatedProject;
};

