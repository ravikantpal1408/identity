using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserDtoForRegisteration
    {
        [Required(ErrorMessage="Username is blank")]
        [EmailAddress(ErrorMessage="Not a valid Email")]
        public string Username { get; set; }
        
        
        [Required]
        [MinLength(4, ErrorMessage="Password should be minimum 4 character.")]
        [MaxLength(20, ErrorMessage = "Password cannot be more than 20 characters.")]
        public string Password { get; set; }
        
        [Required]
        public string Gender { get; set; }
        
        [Required]
        public string KnownAs { get; set; }
        
        [Required]
        public DateTime DateOfBirth { get; set; }
        
        [Required]
        public string City { get; set; }
        
        [Required]
        public string Country { get; set; }
        
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }


        public UserDtoForRegisteration()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
            
        }




    }
}