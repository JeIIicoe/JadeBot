const { SlashCommandBuilder } = require('discord.js');
const { activeTimers } = require('.//trailblazePower.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletealarm')
        .setDescription('Delete your current alarm.'),
    async execute(interaction) {
        if (activeTimers[interaction.user.id]) {
            clearTimeout(activeTimers[interaction.user.id]);
            delete activeTimers[interaction.user.id];
            await interaction.reply('Your alarm has been successfully deleted.');
        } else {
            await interaction.reply('You do not have an active alarm.');
        }
    },
};
