# FORMANIA – Drag & Drop Form Designer

## Description
Welcome to the Form Designer project, this is an application to create forms for designers to make their own forms without programming. The Form Designer project provides a user friendly interface with a toolbox of form components, such as text inputs, checkboxes, fileuploader and more. Designers can simply drag these components onto the canvas, arrange them as desired, and customize their properties through configuration menu as they want.

## Pre-requirements
1. Java 17
2. Maven
3. PostgreSql
4. Eclipse for java(optional)
   Visual Studio Code(optional)
   Intelij Idea(optional)

## How to Install and Run
--- For BackEnd ---<br />
Before starting, you have to extract backend folder from zip and create a database named "formDesigner" in postgresql.<br />
You can do this via pgAdmin 4.<br />
Our backend uses 5433 as port number.<br />
If you want to change database name and other settings, go to "/backend/formDesigner/src/main/resources/application.properties".<br />

If you are using Intelij IDEA,<br />
Click "file>open>Project from existing sources".<br />
Select "{projectName}/backend/formDesigner" folder.<br />
Select "Import project from external model" and select "Maven".<br />
Click Finish.<br />
click "file->settings->Build,Execution,Deployment->Build Tools->Maven"<br />
set Maven Home path to "Bundled(Maven 3)", click apply and ok.<br />
Now you can build and run code.<br />

If you are using Eclipse,<br />
Click "File>Open project from file system".<br />
Click "directory" and select "{projectName}/backend/formDesigner" folder.<br />
Click finish.<br />
Now you can build and run code.<br />

If there is "Started FormDesignerApplication..." text in the console, the code runned successfully.<br />

--- For FrontEnd ---<br />
In Visual Studio Code, click "file>open folder" and select project folder.<br />
After that, open terminal and go to "form-designer" directory via writing "cd form-designer".<br />
Write on terminal, "npm install react-scripts --save"<br />
Now you can start application by writing "npm start".<br />
