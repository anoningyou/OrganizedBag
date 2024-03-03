using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    /// <summary>
    /// Controller for handling user account-related operations.
    /// </summary>
    public class AccountController:BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Represents a controller for managing user accounts.
        /// </summary>
        public AccountController (
            IDispatcher dispatcher,
            UserManager<AppUser> userManager,
            ITokenService tokenService,
            IMapper mapper) : base(dispatcher)
        {
            _mapper = mapper;
            _userManager = userManager;
            _tokenService = tokenService;           
        }

        #region public
        
        [HttpPost(nameof(Register))]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExistAsync(registerDto.Username))
                return BadRequest(new string[]{"Username is taken"});
            var user = _mapper.Map<AppUser>(registerDto);
           

            user.UserName = registerDto.Username.ToLower();

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded) return BadRequest(result.Errors.Select(e => e.Description));

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if(!roleResult.Succeeded) return BadRequest(roleResult.Errors.Select(e => e.Description));

            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Token = await _tokenService.CreateTocken(user),
            };
        }

        [HttpPost(nameof(Login))]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
            .SingleOrDefaultAsync(x=>x.UserName == loginDto.Username.ToLower());

            if(user == null) return Unauthorized("Invalid username");

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if(!result) return Unauthorized("Invalid password");

             return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Token = await _tokenService.CreateTocken(user)
            };
        }

        [HttpGet(nameof(GetCurrentUser))]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User.GetUserId();

            if(userId == Guid.Empty) 
                return Unauthorized("Unauthorized");

            var user = await _userManager.Users
                .SingleOrDefaultAsync(x=>x.Id == userId);

            if(user == null) 
                return Unauthorized("Unauthorized");

             return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Token = await _tokenService.CreateTocken(user)
            };
        }

        #endregion

        #region private

        private async Task<bool> UserExistAsync(string username)
        {
            return await _userManager.Users.AnyAsync(u => u.UserName== username.ToLower());
        }

        #endregion
        
    }
}