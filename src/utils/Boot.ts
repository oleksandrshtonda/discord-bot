import path from "node:path";
import fs from "node:fs";
import { BotClient } from "../OverridedClasses/BotClient";
import { Collection, REST, Routes } from "discord.js";
import { token, clientId, guildId } from "../../config";


export class Boot {
  /** Boot.loadCommands - it needs to allow the bot to detect your commands and use them */
  static loadCommands(client: BotClient): void {
    const commandPath = path.join(__dirname, '../commands');
    const commandsFolders = fs.readdirSync(commandPath);
    client.commands = new Collection();
    
    console.clear();
    console.log("Started loading commands...");
    
    for (const folder of commandsFolders) {
      const commandsPath = path.join(commandPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
      
      console.log(`\tModule: ${folder}`);
      
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
          console.log(`\t\tCommand: ${command.data.name}`)
          client.commands.set(command.data.name, command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      }
    }
    
    console.log("Finished loading commands...\n");
  }
  
  /**
   * Boot.deployCommands - it needs to deploy your commands so user can see them.
   *
   * You need to put token of the bot, guildId and clientId to config.ts file at root of this project
   *
   * Find your clientId here - {@link https://discord.com/developers/applications} >
   * "General Information" > application id
   *
   * Find your guildId here - {@link https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID} >
   * Right-click the server title > "Copy ID"
   * */
  static deployCommands(deleteOldCommands: boolean): void {
    const commandPath = path.join(__dirname, '../commands');
    const commandsFolders = fs.readdirSync(commandPath);
    const commands = [];
    
    for (const folder of commandsFolders) {
      const commandsPath = path.join(commandPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      }
    }
    
    const rest = new REST().setToken(token);
    
    (async () => {
      try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
        // here we delete all deployed commands
        if (deleteOldCommands) {
          rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
            .then(() => console.log('Successfully deleted all guild commands.'))
            .catch(console.error);
        }
        
        // here we deploy commands
        const data: string[] = await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: commands },
        ) as string[];
        
        console.log(`Successfully refreshed ${data.length} application (/) commands.`);
      } catch (error) {
        console.error(error);
      }
    })();
  }
}