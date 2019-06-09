using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers {
    [AllowAnonymous]
    [Route ("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase {

        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController (IConfiguration config, IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager) {
            _signInManager = signInManager;
            _userManager = userManager;
            _config = config;
            _mapper = mapper;
        }

        [HttpPost ("register")]
        public async Task<IActionResult> Register (UserDtoForRegisteration userRegistrationDto) {

            var userToCreate = _mapper.Map<User> (userRegistrationDto);

            var result = await _userManager.CreateAsync (userToCreate, userRegistrationDto.Password);

            var userToReturn = _mapper.Map<UserForDetailDto> (userToCreate);

            if (result.Succeeded) {
                return CreatedAtRoute ("GetUser", new { controller = "Users", id = userToCreate.Id }, userToReturn);
            }

            return BadRequest (result.Errors);

        }

        [HttpPost ("login")]
        public async Task<IActionResult> Login (UserForLoginDto userForLoginDto) {

            var user = await _userManager.FindByNameAsync (userForLoginDto.Username);
            var result = await _signInManager.CheckPasswordSignInAsync (user, userForLoginDto.Password, false);

            if (result.Succeeded) {
                var appUser = await _userManager.Users.Include (p => p.Photos)
                    .FirstOrDefaultAsync (u => u.NormalizedUserName == userForLoginDto.Username.ToUpper ());

                var userToReturn = _mapper.Map<UserForListDto> (appUser);
                return Ok (new {
                    token = GenerateJwtToken (appUser).Result,
                        user = userToReturn
                });
            }

            return Unauthorized ();

        }

        private async Task<string> GenerateJwtToken (User user) {


            var claims = new List<Claim> {
                new Claim (ClaimTypes.NameIdentifier, user.Id.ToString ()),
                new Claim (ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);


            foreach(var role in roles) {

                claims.Add(new Claim(ClaimTypes.Role, role));

            }

            var key = new Microsoft.IdentityModel.Tokens
                .SymmetricSecurityKey (Encoding.UTF8
                    .GetBytes (_config
                        .GetSection ("AppSettings:Token").Value));

            var creds = new Microsoft.IdentityModel.Tokens
                .SigningCredentials (key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new Microsoft.IdentityModel.Tokens
                .SecurityTokenDescriptor {
                    Subject = new ClaimsIdentity (claims),
                    Expires = DateTime.Now.AddDays (1),
                    SigningCredentials = creds
                };

            var tokenHandler = new JwtSecurityTokenHandler ();

            var token = tokenHandler.CreateToken (tokenDescriptor);

            return tokenHandler.WriteToken (token);
        }

    }
}