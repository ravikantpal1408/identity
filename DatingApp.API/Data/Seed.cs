using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        public Seed(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public void SeedUsers()
        {
            if (!_userManager.Users.Any())
            {
                var roles = new List<Role> {
                    new Role{Name = "Member"},
                    new Role{Name = "Admin"},
                    new Role{Name = "Moderator"},
                    new Role{Name = "VIP"},
                };

                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);

                foreach(var role in roles) {
                    _roleManager.CreateAsync(role).Wait();
                }

                foreach (var user in users)
                {
                    user.Photos.SingleOrDefault().isApproved = true;
                    _userManager.CreateAsync(user, "password").Wait();
                    _userManager.AddToRoleAsync(user, "Member").Wait();

                }


                var adminUser = new User {
                    UserName = "Admin"
                };


                IdentityResult result = _userManager.CreateAsync(adminUser, "password").Result;

                if(result.Succeeded) {
                    var admin = _userManager.FindByNameAsync("Admin").Result;
                    _userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator"}).Wait();
                }
            }

        }

    }
}