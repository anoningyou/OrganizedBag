using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.data.migrations
{
    /// <inheritdoc />
    public partial class AddComplectItemCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Complects_AspNetUsers_UserId",
                table: "Complects");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Complects",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Count",
                table: "ComplectItems",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Complects_AspNetUsers_UserId",
                table: "Complects",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Complects_AspNetUsers_UserId",
                table: "Complects");

            migrationBuilder.DropColumn(
                name: "Count",
                table: "ComplectItems");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Complects",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Complects_AspNetUsers_UserId",
                table: "Complects",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
