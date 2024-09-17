import { CommandInteraction, SlashCommandBuilder } from "discord.js";

interface UserInDB {
  userId: string;
  balance: number;
}

// our Database
const DB: UserInDB[] = [];

export const data = new SlashCommandBuilder().setName("balance").setDescription("How much money do you have?");
export const execute = async (interaction: CommandInteraction) => {
  const userId = interaction.user.id;
  
  // finding the user by user.id
  for (const user of DB) {
    if (user.userId === userId) {
      await interaction.reply("Wow! You have " + user.balance + " hryvna!");
      return;
    }
  }
  
  DB.push({ userId, balance: 0 });
  
  await interaction.reply("Wait... Uhm... Okay, I have created a wallet for you. Now try again :)")
}
