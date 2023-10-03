using System;
using System.Collections.Generic;

namespace Program
{
    public class PokemonMaster
    {
        public string Name { get; set; }
        public int NoToEvolve { get; set; }
        public string EvolveTo { get; set; }

        public PokemonMaster(string name, int noToEvolve, string evolveTo)
        {
            this.Name = name;
            this.NoToEvolve = noToEvolve;
            this.EvolveTo = evolveTo;
        }
    }

    public class Pokemon
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public string nickname { get; set; }
        public float hp { get; set; }
        public float current_hp { get; set; }
        public float exp { get; set; }
        public int self_dmg_multiplier { get; set; }
        public string skill { get; set; }
        public int skill_dmg { get; set; }
        public string title { get; set; }
        public int prestige_lvl { get; set; } 
        public bool active { get; set; }

        public Pokemon(string _name, string _nickname, float _hp, float _exp, string _skill, int _skill_dmg, int _self_dmg_multiplier, string title)
        {
            this.id = Guid.NewGuid();
            this.name = _name;
            this.nickname = _nickname;
            this.hp = _hp;
            this.current_hp = _hp;
            this.exp = _exp;
            this.skill = _skill;
            this.skill_dmg = _skill_dmg;
            this.self_dmg_multiplier = _self_dmg_multiplier;
            this.title = title;
            this.prestige_lvl = 0;
            this.active = true;
        }

        public Pokemon()
        {
            // Empty constructor required by Entity Framework
        }

        public virtual void calculateDamage(int dmg) {}

        public bool Equal(Pokemon other)
        {
            if (other == null || other is not Pokemon)
            {
                return false;
            }

            return this.id == other.id;
        }

        // public void display_info()
        // {
        //     List<object> info = new List<object>{
        //         this.id, this.name, this.current_hp, this.exp, this.skill, this.skill_dmg, this.self_dmg_multiplier, this.active
        //     };
        //     foreach (object element in info)
        //     {
        //         Console.WriteLine(element);
        //     }
        // }
    }

    public class Pikachu : Pokemon
    {
        public Pikachu() {}
        public Pikachu(string _name, string _nickname, float _hp, float _exp) :
        base(_name, _nickname, _hp, _exp, "Lightning Bolt", 25, 1, "The Newbie")
        {

        }

        public override void calculateDamage(int dmg)
        {
            this.current_hp -= dmg * this.self_dmg_multiplier;
        }
    }

    public class Eevee : Pokemon
    {
        public Eevee() {}
        public Eevee(string _name, string _nickname, float _hp, float _exp) :
        base(_name, _nickname, _hp, _exp, "Run Away", 20, 2, "The Newbie")
        {

        }

        public override void calculateDamage(int dmg)
        {
            this.current_hp -= dmg * this.self_dmg_multiplier;
        }

    }

    public class Charmander : Pokemon
    {
        public Charmander() {}
        public Charmander(string _name, string _nickname, float _hp, float _exp) :
        base(_name, _nickname, _hp, _exp, "Solar Power", 15, 3, "The Newbie")
        {

        }

        public override void calculateDamage(int dmg)
        {
            this.current_hp -= dmg * this.self_dmg_multiplier;
        }
    }
}