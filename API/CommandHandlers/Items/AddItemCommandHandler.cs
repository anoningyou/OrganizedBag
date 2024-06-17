using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;

namespace API;

/// <summary>
/// Initializes a new instance of the <see cref="AddItemCommandHandler"/> class.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="dispatcher">The dispatcher.</param>
public class AddItemCommandHandler(IUnitOfWork<DataContext> unitOfWork, IDispatcher dispatcher)
    : ICommandHandler<AddItemCommand, ItemDto>
{
    private readonly IDispatcher _dispatcher = dispatcher;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<Item, Guid> _repositoryItems = unitOfWork.GetRepository<Item, Guid>();

    ///<inheritdoc/>
    public async Task<ItemDto> HandleAsync(AddItemCommand command)
    {
        Item item = await _repositoryItems.AddAsync( 
            await _dispatcher.QueryAsync(new GetItemQuery
            {
                ItemDto = command.ItemDto,
                UserId = command.UserId
            })
        );

        await _uow.Complete();

        command.ItemDto.Id = item.Id;

        return command.ItemDto;
    }
}