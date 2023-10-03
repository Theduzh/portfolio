using System;
using System.Collections.Generic;
using System.Linq;
using context;

namespace Program
{
    class Frontend
    {
        public static List<Pokemon> inventory = Database.db_control(true);
        static void Main(string[] args)
        {
            // PokemonMaster list for checking pokemon evolution availability.    
            List<PokemonMaster> pokemonMaster = new List<PokemonMaster>()
            {
                new PokemonMaster("Pikachu", 2, "Raichu"),
                new PokemonMaster("Eevee", 3, "Flareon"),
                new PokemonMaster("Charmander", 1, "Charmeleon")
            };


            //Use "Environment.Exit(0);" if you want to implement an exit of the console program
            //Start your assignment 1 requirements below.


            // Creates DB in case

            using (var context = new Context())
            {
                context.Database.EnsureCreated();
            }

            Dictionary<string, Action> functions = new Dictionary<string, Action>()
                {
                    {"1", () => add_pokemon()},
                    {"2", () => display_pokemon()},
                    {"3", () => check_evolve(pokemonMaster)},
                    {"4", () => evolve_pokemon(pokemonMaster)},
                    {"5", () => rank_up_pokemon()},
                    {"6", () => battle_pokemon()},
                    {"7", () => open_bag()},
                    {"8", () => open_pc()},
                    {"9", () => release_pokemon()},
                    {"10", () => Database.db_save()},
                    {"q", () => end_program()}
                    // {"test", () => {
                    //     foreach (Pokemon pokemon in inventory)
                    //     {
                    //         pokemon.display_info();
                    //     }
                    // }}
                };

            // Main function to play Pokemon Pocket
            while (true)
            {

                Console.WriteLine("*************************************************");
                Console.WriteLine("Welcome to Pokemon Pocket App");
                Console.WriteLine("*************************************************");
                Console.WriteLine("(1). Add Pokemon to my Pocket");
                Console.WriteLine("(2). List pokemon(s) in my pocket");
                Console.WriteLine("(3). Check if I can evolve pokemon(s)");
                Console.WriteLine("(4). Evolve Pokemon");
                Console.WriteLine("(5). Prestige Pokemon");
                Console.WriteLine("(6). Battle Pokemon");
                Console.WriteLine("(7). Open Bag");
                Console.WriteLine("(8). Open PC");
                Console.WriteLine("(9). Release Pokemon");
                Console.WriteLine("(10). Save game");
                Console.Write($"Please only enter [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] or Q to quit: ");
                var choice = Console.ReadLine();

                // Function stored


                if (functions.ContainsKey(choice.ToLower().Trim()))
                {
                    var function = functions[choice.ToLower().Trim()];
                    function();
                    Console.WriteLine("Press any to continue");
                    Console.ReadKey();
                    Console.WriteLine("\b");
                }

                else { continue; }
            }

        }
        static void end_program()
        {
            Console.WriteLine("*************************************************");
            Console.WriteLine("♥♥♥  Thank you for playing Pokemon Pocket  ♥♥♥");
            Console.WriteLine("*************************************************");
            System.Environment.Exit(0);
        }

        static void add_pokemon()
        {
            List<string> pokemons = new List<string> {
                "pikachu", "eevee", "charmander"
            };

            while (true)
            {
                float num_hp;
                float num_exp;

                // Syntax checks
                Console.WriteLine("------------------------------------------------");
                Console.Write("Enter the Pokemon's name you want to add: ");
                string name = Console.ReadLine();
                name = name.Trim().ToLower();
                if (!pokemons.Contains(name))
                {
                    Console.WriteLine("Please enter a valid pokemon name [Pikachu, Eevee, Charmander]");
                    break;
                }

                Console.Write("Enter the Pokemon's Hp: ");
                string hp = Console.ReadLine();
                if (!float.TryParse(hp, out num_hp))
                {
                    Console.WriteLine("Please enter a valid number");
                    continue;
                }

                if (num_hp < 0)
                {
                    Console.WriteLine("Please enter a number of more than 0");
                    continue;
                }

                Console.Write("Enter the Pokemon's Exp: ");
                string exp = Console.ReadLine();
                if (!float.TryParse(exp, out num_exp))
                {
                    Console.WriteLine("Please enter a valid number");
                    continue;
                }

                if (num_exp < 0)
                {
                    Console.WriteLine("Please enter a number of more than 0");
                    continue;
                }



                Console.Write("Enter a nickname for your pokemon: ");
                string nickname = Console.ReadLine();
                nickname = nickname.Trim();


                if (string.IsNullOrEmpty(nickname))
                {
                    nickname = name;
                }

                // Create Pokemon

                if (name == "pikachu")
                {
                    Pikachu pikachu = new Pikachu(name, nickname, num_hp, num_exp);
                    inventory.Add(pikachu);
                    Console.WriteLine($"{nickname}(Pikachu) was successfully created\n");
                    break;
                }

                else if (name == "eevee")
                {
                    Eevee eevee = new Eevee(name, nickname, num_hp, num_exp);
                    inventory.Add(eevee);
                    Console.WriteLine($"{nickname}(Eevee) was successfully created\n");
                    break;
                }

                else if (name == "charmander")
                {
                    Charmander charmander = new Charmander(name, nickname, num_hp, num_exp);
                    inventory.Add(charmander);
                    Console.WriteLine($"{nickname}(Charmander) was successfully created\n");
                    break;
                }

                else
                {
                    Console.WriteLine("Invalid entry, please try again");
                    continue;
                }
            }
        }

        static void display_pokemon()
        {
            if (inventory.Count == 0)
            {
                Console.WriteLine("!!! YOU HAVE NO POKEMON !!!");
            }
            inventory = inventory.OrderByDescending(i => ((Pokemon)i).hp).ToList();
            foreach (Pokemon pokemon in inventory)
            {
                Console.WriteLine("---------------------------------");
                Console.WriteLine($"Name: {pokemon.nickname} {pokemon.title}");
                Console.WriteLine($"Species: {pokemon.name}");
                Console.WriteLine($"HP: {pokemon.current_hp}/{pokemon.hp}");
                Console.WriteLine($"Exp: {pokemon.exp}");
                Console.WriteLine($"Skill: {pokemon.skill}");
                Console.WriteLine($"Skill Damage: {pokemon.skill_dmg}");
                Console.WriteLine("---------------------------------");
            }
        }

        static void check_evolve(List<PokemonMaster> pokemonMasters)
        {
            if (inventory.Count == 0)
            {
                Console.WriteLine("!!! YOU HAVE NO POKEMON !!!");
            }
            List<int> pokemon_no = Helper.get_pokemon_no();
            var (pikachu_no, eevee_no, charmander_no) = (pokemon_no[0], pokemon_no[1], pokemon_no[2]);
            var (_pikachu, _eevee, _charmander) = (pokemonMasters[0], pokemonMasters[1], pokemonMasters[2]);

            if (pikachu_no >= _pikachu.NoToEvolve)
            {
                Console.WriteLine($"Pikachu --> Raichu");
            }

            if (eevee_no >= _eevee.NoToEvolve)
            {
                Console.WriteLine($"Eevee --> Flareon");
            }

            if (charmander_no >= _charmander.NoToEvolve)
            {
                Console.WriteLine($"Charmander --> Charmeleon");
            }
        }

        static void evolve_pokemon(List<PokemonMaster> pokemonMasters)
        {
            if (inventory.Count == 0)
            {
                Console.WriteLine("!!! YOU HAVE NO POKEMON !!!");
            }
            List<int> pokemon_no = Helper.get_pokemon_no();
            var (pikachu_no, eevee_no, charmander_no) = (pokemon_no[0], pokemon_no[1], pokemon_no[2]);
            var (_pikachu, _eevee, _charmander) = (pokemonMasters[0], pokemonMasters[1], pokemonMasters[2]);

            if (pikachu_no >= _pikachu.NoToEvolve)
            {
                Console.WriteLine("Wait what Pikachu is evolving???");
                Console.ReadKey();
                Console.WriteLine("Your Pikachu has evolved into a Raichu!");
                Console.ReadKey();

                int popped = 0;
                foreach (Pokemon pokemon in inventory.ToList())
                {
                    if (popped >= _pikachu.NoToEvolve)
                    {
                        break;
                    }

                    if (pokemon.name == "pikachu")
                    {
                        inventory.Remove(pokemon);
                        Database.delete_pokemon(pokemon);
                    }
                }
                Console.Write("What nickname shall be given to your new Raichu: ");
                string nickname = Console.ReadLine();

                if (string.IsNullOrEmpty(nickname))
                {
                    nickname = "pikachu";
                }

                Pokemon raichu = new Pikachu("Raichu", nickname, 100, 0);
                inventory.Add(raichu);
            }

            if (eevee_no >= _eevee.NoToEvolve)
            {
                Console.WriteLine("Wait what Eevee is evolving???");
                Console.ReadKey();
                Console.WriteLine("Your Eevee has evolved into a Flareon!");
                Console.ReadKey();

                int popped = 0;
                foreach (Pokemon pokemon in inventory.ToList())
                {
                    if (popped >= _eevee.NoToEvolve)
                    {
                        break;
                    }

                    if (pokemon.name == "eevee")
                    {
                        inventory.Remove(pokemon);
                        Database.delete_pokemon(pokemon);
                    }
                }
                Console.Write("What nickname shall be given to your new Flareon: ");
                string nickname = Console.ReadLine();

                if (string.IsNullOrEmpty(nickname))
                {
                    nickname = "eevee";
                }

                
                Pokemon flareon = new Eevee("Flareon", nickname, 100, 0);
                inventory.Add(flareon);
            }

            if (charmander_no >= _charmander.NoToEvolve)
            {
                Console.WriteLine("Wait what Charmander is evolving???");
                Console.ReadKey();
                Console.WriteLine("Your Charmander has evolved into a Charmeleon!");
                Console.ReadKey();

                int popped = 0;
                foreach (Pokemon pokemon in inventory.ToList())
                {
                    if (popped >= _charmander.NoToEvolve)
                    {
                        break;
                    }

                    if (pokemon.name == "charmander")
                    {
                        inventory.Remove(pokemon);
                        Database.delete_pokemon(pokemon);
                    }
                }
                Console.Write("What nickname shall be given to your new Charmeleon: ");
                string nickname = Console.ReadLine();

                if (string.IsNullOrEmpty(nickname))
                {
                    nickname = "charmander";
                }

                Pokemon charmeleon = new Charmander("Charmeleon", nickname, 100, 0);
                inventory.Add(charmeleon);
            }
        }

        static void rank_up_pokemon()
        {
            Console.WriteLine("Who do you want to prestige?");
            Pokemon pokemon = Helper.select_pokemon(inventory);
            if (pokemon is not null)
            {
                if (pokemon.exp < 200)
                {
                    Console.WriteLine("This Pokemon cannot be prestiged yet (exp >= 200 to prestige)");
                    return;
                } // Checks for exp

                switch (pokemon.prestige_lvl)
                {
                    case 0:
                        pokemon.prestige_lvl += 1;
                        pokemon.title = "The Fighter";
                        pokemon.exp -= 200;
                        Console.WriteLine($"{pokemon.name} has prestiged!");
                        break;
                    case 1:
                        pokemon.prestige_lvl += 1;
                        pokemon.title = "The Experienced";
                        pokemon.exp -= 200;
                        Console.WriteLine($"{pokemon.name} has prestiged!");
                        break;
                    case 2:
                        pokemon.prestige_lvl += 1;
                        pokemon.title = "The Champion";
                        pokemon.exp -= 200;
                        Console.WriteLine($"{pokemon.name} has prestiged!");
                        break;
                    case 3:
                        pokemon.prestige_lvl += 1;
                        pokemon.title = "The Immortal";
                        pokemon.exp -= 200;
                        Console.WriteLine($"{pokemon.name} has prestiged!");
                        break;
                    case 4:
                        Console.WriteLine("Your Pokemon has reached max prestige level.");
                        break;
                }
            }

        }

        static void battle_pokemon()
        {

            Console.WriteLine("---------------------------------");
            Console.WriteLine("(1). Battle Wild Pokemon");
            Console.WriteLine("(2). 1 v 1");
            string input = Console.ReadLine();

            switch (input)
            {
                case "1":
                    Pokemon chosen_pokemon = Helper.select_pokemon(inventory);
                    if (chosen_pokemon is not null)
                    {
                        Helper.battle_pokemon(chosen_pokemon, Helper.generate_wild_pokemon());
                    }
                    break;

                case "2":
                    Pokemon chosen_1 = Helper.select_pokemon(inventory);
                    Pokemon chosen_2 = Helper.select_pokemon(inventory);
                    if (chosen_1 is null || chosen_2 is null)
                    {
                        break;
                    }

                    if (chosen_1.Equal(chosen_2))
                    {
                        Console.WriteLine("Both Pokemon must be different");
                        break;
                    }

                    Helper.battle_pokemon(chosen_1, chosen_2);
                    break;
            }
        }
        static void open_bag()
        {
            Console.WriteLine("-------------------------------------------------");
            Console.WriteLine("Which item would you like to use");
            Console.WriteLine("(1). Max Potion (Heals all Pokemon to Max Hp)");
            Console.WriteLine("(2). HP UP (Boost the HP stat of a Pokemon)");
            Console.WriteLine("(3). Protein (Boost the ATK stat of a Pokemon)");
            Console.Write("Choose a item to use: ");
            string input = Console.ReadLine();

            switch (input)
            {
                case "1":
                    {
                        foreach (Pokemon pokemon in inventory) { pokemon.current_hp = pokemon.hp; }
                        Console.WriteLine("Your Pokemons has been healed");
                    }
                    break;

                case "2":
                    {
                        Pokemon pokemon = Helper.select_pokemon(inventory);
                        if (pokemon is not null)
                        {
                            Random random = new Random();
                            int hp = random.Next(20, 70);
                            pokemon.hp += hp;
                            Console.WriteLine($"{pokemon.nickname}'s hp has been increased by {hp}");
                        }
                        break;
                    }
                case "3":
                    {
                        Pokemon pokemon = Helper.select_pokemon(inventory);
                        if (pokemon is not null)
                        {
                            Random random = new Random();
                            int atk = random.Next(10, 20);
                            pokemon.skill_dmg += atk;
                            Console.WriteLine($"{pokemon.nickname}'s {pokemon.skill} damage has been increased by {atk}");
                        }
                        break;
                    }
            }
        }

        public static void open_pc()
        {
            Console.WriteLine("(1). Deposit Pokemon");
            Console.WriteLine("(2). Withdraw Pokemon");
            Console.Write("Choose a function to use: ");
            string input = Console.ReadLine();

            switch (input)
            {
                case "1":
                    {
                        Pokemon pokemon = Helper.select_pokemon(inventory);
                        if (pokemon is not null)
                        {
                            pokemon.active = false;
                            Database.db_save();
                            Frontend.inventory = Database.db_control(true);
                            Console.WriteLine("Transfer Successful");
                        }
                    }
                    break;

                case "2":
                    {
                        List<Pokemon> pc = Database.db_control(false);
                        Pokemon pokemon = Helper.select_pokemon(pc);
                        if (pokemon is not null)
                        {
                            Database.update_pokemon_active(pokemon.id, true);
                            Database.db_save();
                            Frontend.inventory = Database.db_control(true);
                            Console.WriteLine("Transfer Successful");
                        }
                    }
                    break;
            }
        }

        public static void release_pokemon()
        {
            Pokemon pokemon = Helper.select_pokemon(inventory);

            if (pokemon is not null)
            {
                inventory.Remove(pokemon);
                Database.delete_pokemon(pokemon);
                Database.db_save();
            }
        }
    }
}



