using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController:BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager,
            ITokenService tokenService,
             IMapper mapper)
        {
            _mapper = mapper;
            _userManager = userManager;
            _tokenService = tokenService;           
        }

        [HttpPost("register")]
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
                UserName = user.UserName,
                Token = await _tokenService.CreateTocken(user),
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
            .SingleOrDefaultAsync(x=>x.UserName == loginDto.Username.ToLower());

            if(user == null) return Unauthorized("Invalid username");

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if(!result) return Unauthorized("Invalid password");

             return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateTocken(user)
            };
        }

        private async Task<bool> UserExistAsync(string username)
        {
            return await _userManager.Users.AnyAsync(u => u.UserName== username.ToLower());
        }
        
    }
}