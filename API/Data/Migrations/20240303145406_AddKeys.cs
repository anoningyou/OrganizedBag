using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyValues",
                table: "PropertyValues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyParamsCommon",
                table: "PropertyParamsCommon");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyParams",
                table: "PropertyParams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupItems",
                table: "GroupItems");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "PropertyValues",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "PropertyParamsCommon",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "PropertyParams",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "GroupItems",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyValues",
                table: "PropertyValues",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyParamsCommon",
                table: "PropertyParamsCommon",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyParams",
                table: "PropertyParams",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupItems",
                table: "GroupItems",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyValue_ItemId_PropertyId",
                table: "PropertyValues",
                columns: new[] { "ItemId", "PropertyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyParamCommon_PropertyId",
                table: "PropertyParamsCommon",
                column: "PropertyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyParam_PropertyId_UserId",
                table: "PropertyParams",
                columns: new[] { "PropertyId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GroupItem_GroupId_ItemId",
                table: "GroupItems",
                columns: new[] { "GroupId", "ItemId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyValues",
                table: "PropertyValues");

            migrationBuilder.DropIndex(
                name: "IX_PropertyValue_ItemId_PropertyId",
                table: "PropertyValues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyParamsCommon",
                table: "PropertyParamsCommon");

            migrationBuilder.DropIndex(
                name: "IX_PropertyParamCommon_PropertyId",
                table: "PropertyParamsCommon");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyParams",
                table: "PropertyParams");

            migrationBuilder.DropIndex(
                name: "IX_PropertyParam_PropertyId_UserId",
                table: "PropertyParams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupItems",
                table: "GroupItems");

            migrationBuilder.DropIndex(
                name: "IX_GroupItem_GroupId_ItemId",
                table: "GroupItems");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PropertyValues");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PropertyParamsCommon");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PropertyParams");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "GroupItems");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyValues",
                table: "PropertyValues",
                columns: new[] { "ItemId", "PropertyId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyParamsCommon",
                table: "PropertyParamsCommon",
                column: "PropertyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyParams",
                table: "PropertyParams",
                columns: new[] { "PropertyId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupItems",
                table: "GroupItems",
                columns: new[] { "GroupId", "ItemId" });
        }
    }
}
