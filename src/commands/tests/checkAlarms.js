const { SlashCommandBuilder } = require("discord.js");
const { activeTimers } = require('.//trailblazePower.js')
const formatDuration = require('../../modularity/formatDuration.js');
const formatDateTime = require("../../modularity/dateTime.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listalarms")
    .setDescription("List all active alarms."),
  async execute(interaction) {
    let replyMessage = `# Until full power <:tbp:1201581164671029358> :\n`;

    if (Object.keys(activeTimers).length === 0) {
      replyMessage += "There are no active alarms.";
    } else {
      for (const userId in activeTimers) {
        const remainingTime = formatDuration(Math.round((activeTimers[userId].endTime - Date.now()) / 60000));
        replyMessage += `<@${userId}> |**${remainingTime}** until full power.\n`;
      }
    }

    await interaction.reply(replyMessage);
  },
};
