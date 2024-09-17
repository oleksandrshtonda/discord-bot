import path from "node:path";
import fs from "node:fs";
import {BotClient} from "../OverridedClasses/BotClient";
import {Collection} from "discord.js";

export class Boot {
  static loadCommands(client: BotClient): void {
    const commandPath = path.join(__dirname, '../commands');
    const commandsFolders = fs.readdirSync(commandPath);
    client.commands = new Collection();
    
    for (const folder of commandsFolders) {
      const commandsPath = path.join(commandPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
          console.log("Booting commands...", command.data.name);
          client.commands.set(command.data.name, command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      }
    }
  }
}