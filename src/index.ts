import { Collection, Events, GatewayIntentBits} from "discord.js";
import { token } from "../config";
import {BotClient} from "./OverridedClasses/BotClient";
import {Boot} from "./utils/Boot";


const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

Boot.loadCommands(client);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  const command = interaction.client.commands.get(interaction.commandName);
  console.log(command);
  
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
    } else {
      await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
  }
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);