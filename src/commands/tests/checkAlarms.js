const { SlashCommandBuilder } = require("discord.js");
const { activeTimers } = require('.//trailblazePower.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listalarms")
    .setDescription("List all active alarms."),
  async execute(interaction) {
    let replyMessage = "Active Alarms:\n";

    if (Object.keys(activeTimers).length === 0) {
      replyMessage += "There are no active alarms.";
    } else {
      for (const userId in activeTimers) {
        const remainingTime = Math.round((activeTimers[userId].endTime - Date.now()) / 60000);
        replyMessage += `<@${userId}> has an alarm with about ${remainingTime} minutes left.\n`;
      }
    }

    await interaction.reply(replyMessage);
  },
};
