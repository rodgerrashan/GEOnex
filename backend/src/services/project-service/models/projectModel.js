const {ObjectId} = require('mongoose');
class Project{
    constructor(name, des, createdBy){
        this.name = name;
        this.desciption = des;
        this.createdBy = createdBy;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

}

module.exports = Project;