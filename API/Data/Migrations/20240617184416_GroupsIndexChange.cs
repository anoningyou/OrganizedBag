using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class GroupsIndexChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_GroupItem_GroupId_ItemId",
                table: "GroupItems",
                newName: "UQ_GroupItem_GroupId_ItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "UQ_GroupItem_GroupId_ItemId",
                table: "GroupItems",
                newName: "IX_GroupItem_GroupId_ItemId");
        }
    }
}
