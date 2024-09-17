import { Client, Collection } from 'discord.js';
import { Command } from './types/Command'; // Это интерфейс для команд

export class BotClient extends Client {
  commands: Collection<string, Command> = new Collection();
}
