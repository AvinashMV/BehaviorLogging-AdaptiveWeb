# BehaviorLogging-AdaptiveWeb



What is this project is about?

Adaptive web project. After securly logged in to the system, each user is displayed a static page of stackoverflow. User intereactions on the page (behavior) is captured and it is displayed as visualizaiton. Currently this project tracks "Search" ,"Scroll" and "AskQuestion" in the stackOverflow page. 

Implemented using - node.js, express.js, handlebars, mongodb, JavaScript ES6, HTML5, CSS3, Bootstrap 4, REST APIs.  


Instructions to execute ( on mac)

1.	Required Dependencies - node.js , chrome v8, mongo - DB. 
2.	Place project under home directory and run npm install.
3.	Place a folder (resource path for mongo db ) mongo-data under home. 
	Path should be ~/mongo-data.
4.	To run mongo db, Install mongoDB in home folder ~/mongo. 
	Inside the terminal navigate to ~/mongo/bin.  From bin directory run the command  		
	./mongod - - dbpath ~/mongo-data.
5.	In chrome type - http://localhost:3000/


Features of the Project: 

*	Home page is http://localhost:3000/ which is index.hbs in /views/index.hbs

*	Authentication system is done from npm module passport. Password is hashed. It is one way algorithm  	 for secure storage so please remember the password. 

*	Primarily used node.js and express.js. 

*	Handlebars is used as view Engine.  

*	Visualization is done from Chart.js library module. 
