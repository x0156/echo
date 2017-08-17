var mongoose = require('mongoose');
var async = require('async');

var userIds = [];
var userList = [
	{
		name: 'Name0',
		lastname: 'Lastname1'	
	},
	{
		name: 'Name2',
		lastname: 'Lastname3'	
	},
	{
		name: 'Name4',
		lastname: 'Lastname5'	
	},
];
function createUserTestData(done) {
    var userModel = mongoose.model('user');

	var userModels = userList.map(function (user) {
        return new userModel(user);
    });

    var deferred = [
        userModel.remove.bind(userModel)
    ];

    deferred = deferred.concat(userModels.map(function (user) {
        return user.save.bind(user);
    }));

    async.series(deferred, done);
}
function setUserIds(done) {
    mongoose.model('user').find().exec(function (err, results) {
        if (err) {
            return done(err);
        }

        userIds = [];
        results.forEach(function(user){
            userIds.push(user._id);
        });

        return done();
    });
}
function getUserIds() {
    return userIds;
}

var placeIds = [];
var placeList = [
	{
		name: 'Name6'	
	},
	{
		name: 'Name7'	
	},
	{
		name: 'Name8'	
	},
];
function createPlaceTestData(done) {
    var placeModel = mongoose.model('place');

	var placeModels = placeList.map(function (place) {
        return new placeModel(place);
    });

    var deferred = [
        placeModel.remove.bind(placeModel)
    ];

    deferred = deferred.concat(placeModels.map(function (place) {
        return place.save.bind(place);
    }));

    async.series(deferred, done);
}
function setPlaceIds(done) {
    mongoose.model('place').find().exec(function (err, results) {
        if (err) {
            return done(err);
        }

        placeIds = [];
        results.forEach(function(place){
            placeIds.push(place._id);
        });

        return done();
    });
}
function getPlaceIds() {
    return placeIds;
}

module.exports = {
    createUserTestData: createUserTestData,
    setUserIds: setUserIds,
	getUserIds: getUserIds,
    createPlaceTestData: createPlaceTestData,
    setPlaceIds: setPlaceIds,
	getPlaceIds: getPlaceIds,
};
