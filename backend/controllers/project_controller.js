import User from "../models/user_models.js";
import * as projectService from "../services/project_service.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    const loggedInUser = await User.findOne({ email: req.user.email });
    const userId = loggedInUser._id;

    const newProject = await projectService.createProject({ name, userId });

    return res.status(201).json(newProject);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

export const getAllProject = async (req, res) => {
  try {
    const loggedInUser = await User.findOne({ email: req.user.email });
    const allUserProjects = await projectService.getAllProjectByUser({
      userId: loggedInUser._id,
    });
    if (!allUserProjects) {
      return res.status(404).json({ message: "No projects found" });
    }
    return res.status(200).json({
      projects: allUserProjects,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
};

export const addUserToProject = async (req,res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {projectId, users} = req.body;

    const loggedInUser = await User.findOne({
      email:req.user.email
    });

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId:loggedInUser._id
    })

    return res.status(200).json({project})

  } catch (err) {
    console.log(err);
    res.status(400).json({error:err.message});
  }
};

export const getProjectById = async (req,res) =>{
  const {projectId} = req.params;

  try {
    const project = await projectService.getProjectById({
      projectId
    });

    return res.status(200).json({project});
  } catch (err) {
    console.log(err);
    res.status(400).json({error:err.message});
  }
};

export const updateFileTree = async (req,res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }

  try {
    const {projectId, fileTree} = req.body;

    const project = await projectService.updateFileTree({
      projectId,
      fileTree
    })

    return res.status(200).json({
      project
    })
  } catch (err) {
    console.log(err);
    res.status(400).json({error:err.message})
  }
};

export const addMessageToProject = async (req,res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }

  try {
    const {projectId, message} = req.body;
    const loggedInUser = await User.findOne({
      email:req.user.email
    });

    console.log(projectId,message);

    const project = await projectService.addMessageToProject({
      projectId,
      message,
      sender:loggedInUser._id,
    })

    return res.status(200).json({
      project
    })
  } catch (err) {
    console.log(err);
    res.status(400).json({error:err.message})
  }
}

