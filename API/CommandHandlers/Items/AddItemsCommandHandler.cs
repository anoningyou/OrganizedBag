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
public class AddItemsCommandHandler(IUnitOfWork<DataContext> unitOfWork, IDispatcher dispatcher)
    : ICommandHandler<AddItemsCommand, List<ItemDto>>
{
    private readonly IDispatcher _dispatcher = dispatcher;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<Item, Guid> _repositoryItems = unitOfWork.GetRepository<Item, Guid>();

    ///<inheritdoc/>
    public async Task<List<ItemDto>> HandleAsync(AddItemsCommand command)
    {
        List<Item> items = new List<Item>();

        foreach (ItemDto itemDto in command.ItemDtos)
        {
            Item item = await _dispatcher.QueryAsync(new GetItemQuery
            {
                ItemDto = itemDto,
                UserId = command.UserId
            });
            items.Add(item);
        }

        await _repositoryItems.AddRangeAsync(items);

        await _uow.Complete();

        return command.ItemDtos;
    }
}