
const { build } = require("../services/treeService");

// exports.processData = (req, res) => {
//     const { data } = req.body;

//     const result = build(data);

//     res.json({
//         user_id: "nirmalkumar_01012004",
//         email_id: "nk4015@srmist.edu.in",
//         college_roll_number: "RA2311056010036",
//         ...result
//     });
// };
exports.processData = (req, res) => {
    let { data } = req.body;

    // 🔥 HANDLE STRING INPUT
    if (typeof data === "string") {
        try {
            data = JSON.parse(data).data;
        } catch {
            data = data.split(",").map(x => x.trim());
        }
    }

    const result = build(data);

    res.json({
        user_id: "nirmalkumar_01012004",
        email_id: "nk4015@srmist.edu.in",
        college_roll_number: "RA2311056010036",
        ...result
    });
};