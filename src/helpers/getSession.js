async function getSession(Model,id) {
    const module_in_session = await Model.findOne({
        attributes:['session_id'],
        where:{
            id
        }
    });
    return module_in_session.session_id;
}

module.exports = getSession;