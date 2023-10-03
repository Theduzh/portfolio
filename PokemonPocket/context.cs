using Microsoft.EntityFrameworkCore;
using Program;

namespace context
{
    public class Context : DbContext
    {
        public DbSet<Pokemon> Pokemons { get; set; }
        public DbSet<Pikachu> Pikachus { get; set; }
        public DbSet<Eevee> Eevee { get; set; }
        public DbSet<Charmander> Charmander { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=pokemon.db");
        }
    }
}