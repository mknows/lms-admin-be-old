const { User, Administration, Student } = require("../models");

(async () => {
  const users = await User.findAll();
  console.log(`[SERVER] ${users.length} Users found.`);

  users.forEach(async user => {
    const user_id = user.id;

    let user_administration = await Administration.findOne({
      where: {
        user_id
      }
    });

    if (!user_administration.is_approved.overall) {
      console.log(`[SERVER] ${user.full_name} administration is not approved.`);
      user_administration.is_approved = {
        "component": {
          "biodata": true,
          "familial": true,
          "files": true,
          "degree": true
        },
        "overall": true
      };

      user_administration = await user_administration.save();

      console.log(`[SERVER] ${user.full_name} administration approved.`);

      await Student.create({
        user_id, semester: 1
      })
    } else {
      console.log(`[SERVER] ${user.full_name} administration already approved.`);
    }
  });
})();