const Backup = require('../../database/backup/BackupModel.js');
const User = require("../../database/userdb/UserSchema");

const getBackup = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const allBackup = await Backup.find({});

        // Group backup objects by date property
        const groupedBackups = allBackup.reduce((acc, backup) => {
            const date = backup.date; // Assuming date is the property you want to group by
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(backup);
            return acc;
        }, {});

        // Convert grouped backups object into array of objects with date tagged
        const backupArray = Object.entries(groupedBackups).map(([date, backups]) => {
            return { date: date, backups: backups };
        });

        // Sort the backup array in descending order based on the date
        backupArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({ data: backupArray });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports={getBackup}