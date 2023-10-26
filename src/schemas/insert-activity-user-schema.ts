import joi from "joi";

type bodyActivityUser = {
    activityId: number
}

const userActivitySchema = joi.object<bodyActivityUser>({
    activityId: joi.number().required()
})

export default userActivitySchema;