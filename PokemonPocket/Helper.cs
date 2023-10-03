using System;
using System.Collections.Generic;
using System.Linq;

namespace Program
{
    class Helper // Helper code that can be reused
    {
#nullable enable
        public static List<Pokemon> inventory = Frontend.inventory;

        public static List<int> get_pokemon_no()
        {
            int pikachu_no = inventory.Count(x => x.name == "pikachu");
            int eevee_no = inventory.Count(x => x.name == "eevee");
            int charmander_no = inventory.Count(x => x.name == "charmander");


            List<int> pokemon_no = new List<int> { pikachu_no, eevee_no, charmander_no };
            return pokemon_no;
        }

        public static Pokemon generate_wild_pokemon()
        {
            Random random = new Random();
            int hp = random.Next(50, 200);

            Pokemon wild_pikachu = new Pikachu("pikachu", "wild_pikachu", hp, 0);
            Pokemon wild_eevee = new Eevee("eevee", "wild_eevee", hp, 0);
            Pokemon wild_charmander = new Charmander("charmander", "wild_charmander", hp, 0);

            Dictionary<int, Pokemon> pokemon_dict = new Dictionary<int, Pokemon>()
                {
                    {1, wild_pikachu},
                    {2, wild_eevee},
                    {3, wild_charmander}
                };

            int random_pokemon_id = random.Next(1, 4);
            Pokemon random_pokemon = pokemon_dict[random_pokemon_id];

            return random_pokemon;
        }

        public static Pokemon? select_pokemon(List<Pokemon> inventory)
        {
            Console.WriteLine("-------------------------------------------------");
            Console.WriteLine("Please choose a Pokemon (eg. 1)");

            // Checks for no pokemon
            if (inventory.Count == 0)
            {
                Console.WriteLine("!!! YOU HAVE NO POKEMON !!!");
                return null;
            }

            for (int i = 0; i < inventory.Count; i++)
            {
                Console.WriteLine($"{i + 1}) {((Pokemon)inventory[i]).nickname} ({((Pokemon)inventory[i]).name})");
            }
            string? chosen = Console.ReadLine();
            int num_chosen;
            if (!int.TryParse(chosen, out num_chosen))
            {
                Console.WriteLine("Please enter an integer");
                return null;
            }

            if (num_chosen > inventory.Count)
            {
                Console.WriteLine("Invalid Pokemon");
                return null;
            }

            // Chooses pokemon from inventory

            Pokemon chosen_pokemon = (Pokemon)inventory[num_chosen - 1];

            return chosen_pokemon;
        }
        public static void battle_pokemon(Pokemon chosen_pokemon, Pokemon other_pokemon)
        {
            while (true)
            {
                // User turn
                Console.WriteLine($"{chosen_pokemon.nickname} uses {chosen_pokemon.skill}!");
                other_pokemon.calculateDamage(chosen_pokemon.skill_dmg);
                if (other_pokemon.current_hp < 1) // Win Clause
                {
                    Console.WriteLine($"{other_pokemon.nickname} has 0/{other_pokemon.hp} hp left, {chosen_pokemon.name} has won.");
                    chosen_pokemon.exp += other_pokemon.hp;
                    Console.WriteLine($"{chosen_pokemon.nickname} has gained {other_pokemon.hp} exp");
                    break;
                }
                Console.WriteLine($"{other_pokemon.nickname} has {other_pokemon.current_hp}/{other_pokemon.hp} HP");

                // Enemy turn
                Console.WriteLine($"{other_pokemon.nickname} uses {other_pokemon.skill}!");
                chosen_pokemon.calculateDamage(other_pokemon.skill_dmg);
                if (chosen_pokemon.current_hp < 1) // Lose clause
                {
                    Console.WriteLine($"{chosen_pokemon.nickname} has 0/{chosen_pokemon.hp} hp left, {other_pokemon.name} has won.");
                    chosen_pokemon.current_hp = chosen_pokemon.hp;
                    break;
                }
                Console.WriteLine($"{chosen_pokemon.nickname} has {chosen_pokemon.current_hp}/{chosen_pokemon.hp} HP");
            }
        }
    }
}