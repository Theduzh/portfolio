using System;
using System.Collections.Generic;
using System.Linq;
using context;

namespace Program
{
    class Database
    {
#nullable enable
        public static List<Pokemon> db_control(bool active)
        {
            using (var context = new Context())
            {
                List<Pokemon> inventory = context.Pokemons
                                            .Where(p => p.active == active)
                                            .ToList();
                return inventory;
            }
        }


        public static void db_save()
        {
            using (var context = new Context())
            {
                foreach (Pokemon pokemon in Frontend.inventory)
                {
                    Pokemon? db_pokemon = context.Pokemons.FirstOrDefault(p => p.id == pokemon.id);
                    if (db_pokemon is not null)
                    {
                        db_pokemon.id = pokemon.id;
                        db_pokemon.name = pokemon.name;
                        db_pokemon.nickname = pokemon.nickname;
                        db_pokemon.current_hp = pokemon.current_hp;
                        db_pokemon.hp = pokemon.current_hp;
                        db_pokemon.exp = pokemon.exp;
                        db_pokemon.active = pokemon.active;
                        context.SaveChanges();
                    }
                    else
                    {
                        context.Pokemons.Add(pokemon);
                        context.SaveChanges();
                    }
                }
                Console.WriteLine("Your game has been saved successfully");
            }
        }
        public static void update_pokemon_active(Guid id, bool active)
        {
            using (var context = new Context())
            {
                Pokemon pokemon = context.Pokemons.Find(id);

                if (pokemon != null)
                {
                    pokemon.active = active;

                    context.SaveChanges();
                }
            }
        }

        public static void delete_pokemon(Pokemon pokemon)
        {
            using (var context = new Context())
            {
                context.Pokemons.Remove(pokemon);
                context.SaveChanges();
            }
        }
    }
}