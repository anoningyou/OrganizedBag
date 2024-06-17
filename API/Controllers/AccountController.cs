using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

/// <remarks>
/// Represents a controller for managing user accounts.
/// </remarks>
public class AccountController(
    IDispatcher dispatcher,
    UserManager<AppUser> userManager,
    ITokenService tokenService,
    IMapper mapper) : BaseApiController(dispatcher)
{
    private readonly UserManager<AppUser> _userManager = userManager;
    private readonly ITokenService _tokenService = tokenService;
    private readonly IMapper _mapper = mapper;

    #region public

    /// <summary>
    /// Registers a new user.
    /// </summary>
    /// <param name="registerDto">The registration information.</param>
    /// <returns>The registered user.</returns>
    [HttpPost(nameof(Register))]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExistAsync(registerDto.Username))
            return BadRequest(new string[]{"Username is taken"});

        AppUser user = _mapper.Map<AppUser>(registerDto);
        
        user.UserName = registerDto.Username.ToLower();

        IdentityResult result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        IdentityResult roleResult = await _userManager.AddToRoleAsync(user, "Member");

        if (!roleResult.Succeeded)
            return BadRequest(roleResult.Errors.Select(e => e.Description));

        return new UserDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Token = await _tokenService.CreateToken(user),
        };
    }

    /// <summary>
    /// Logs in a user.
    /// </summary>
    /// <param name="loginDto">The login information.</param>
    /// <returns>The logged in user.</returns>
    [HttpPost(nameof(Login))]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        AppUser user = await _userManager.Users
            .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

        if (user == null)
            return Unauthorized("Invalid username");

        bool result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!result) 
            return Unauthorized("Invalid password");

        return new UserDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Token = await _tokenService.CreateToken(user)
        };
    }

    /// <summary>
    /// Gets the current user.
    /// </summary>
    /// <returns>The current user.</returns>
    [HttpGet(nameof(GetCurrentUser))]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        Guid userId = User.GetUserId();

        if (userId == Guid.Empty) 
            return Unauthorized("Unauthorized");

        AppUser user = await _userManager.Users
            .SingleOrDefaultAsync(x=>x.Id == userId);

        if (user == null) 
            return Unauthorized("Unauthorized");

            return new UserDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Token = await _tokenService.CreateToken(user)
        };
    }

    #endregion public

    #region private

    private async Task<bool> UserExistAsync(string username)
    {
        return await _userManager.Users.AnyAsync(u => u.UserName== username.ToLower());
    }

    #endregion private
    
}