using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers {

    [ServiceFilter (typeof (LogUserActivity))]
    // [Authorize] // As I have configured global Authorized in Startup.cs
    [Route ("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController (IDatingRepository repo, IMapper mapper) {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers ([FromQuery] UserParams userParams) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);
            
            var userFromRepo = await _repo.GetUser (currentUserId, true);

            userParams.UserId = currentUserId;
            if (string.IsNullOrEmpty (userParams.Gender)) {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }

            var users = await _repo.GetUsers (userParams);
            var returnUsers = _mapper.Map<IEnumerable<UserForListDto>> (users);

            Response.AddPagination (users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok (returnUsers);

        }

        [HttpGet ("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser (int id) {

            var isCurrentUser = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value) == id;

            var user = await _repo.GetUser (id, isCurrentUser);

            var userToReturn = _mapper.Map<UserForDetailDto> (user); // Mapping to user to DTO

            return Ok (userToReturn);
        }

        [HttpPut ("{id}")]
        public async Task<IActionResult> UpdateUser (int id, UserForUpdateDto userForUpdateDto) {
            if (id != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized ();
            }
            var isCurrentUser = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value) == id;

            var userFromRepo = await _repo.GetUser (id, true);

            _mapper.Map (userForUpdateDto, userFromRepo);

            if (await _repo.SaveAll ()) {
                return NoContent ();
            }

            throw new Exception ($"Updating user {id} failed on serve");

        }

        [HttpPost ("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser (int id, int recipientId) {
            if (id != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized ();
            }

            var like = await _repo.GetLike (id, recipientId);

            if (like != null) {
                return BadRequest ("You already liked this user");
            }
            var isCurrentUser = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value) == id;

            if (await _repo.GetUser (recipientId, false) == null) { // checking if user exists
                return NotFound ();
            }

            like = new Like {
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add<Like> (like);

            if (await _repo.SaveAll ()) {
                return Ok ();
            }
            return BadRequest ("Failed to like user");

        }

    }
}