const { Subject } = require("../models");

const subjects = [
    "English",
    "math",
    "art",
    "science",
    "history",
    "music",
    "geography",
    "P.E (Physical Education)",
    "drama",
    "biology",
    "chemistry",
    "physics",
    "I.T (Information Technology)",
    "foreign languages",
    "social studies",
    "technology",
    "philosophy",
    "graphic design",
    "literature",
    "algebra",
    "geometry",
]
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function getRandomLevel(array){
    return array[getRandomArbitrary(1,3)]
}
function getRandomLecturer(array){
    return "{"+array[getRandomArbitrary(1,3)]+"}"
}
    function seeder(){
    for (i = 0; i<subjects.length;i++){
        subjects[i] = capitalizeFirstLetter(subjects[i]);
        Subject.create({
            name: subjects[i],
            number_of_sessions: getRandomArbitrary(5,8),
            degree: "S1",
            level: getRandomLevel(['Beginner','Intermediate','Advanced']),
            lecturer : getRandomLecturer(['15e98720-3f94-11ed-b878-0242ac120002','677743df-08db-4acd-8c51-dfec018301f8']),
            description : `This is the description for ${subjects[i]}`,

        })
    }
}

seeder()