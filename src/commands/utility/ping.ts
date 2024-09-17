import {CommandInteraction, SlashCommandBuilder} from "discord.js";

export const data = new SlashCommandBuilder().setName("ping").setDescription("Are the bot is alive??");
export const execute = async (interaction: CommandInteraction) => {
  await interaction.reply("Pong!")
}
