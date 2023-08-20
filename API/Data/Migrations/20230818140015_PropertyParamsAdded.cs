using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.data.migrations
{
    /// <inheritdoc />
    public partial class PropertyParamsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PropertyParams",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PropertyId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ListOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    ListDisplay = table.Column<bool>(type: "INTEGER", nullable: false),
                    ListWidth = table.Column<int>(type: "INTEGER", nullable: false),
                    ComplectOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    ComplectDisplay = table.Column<bool>(type: "INTEGER", nullable: false),
                    ComplectWidth = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyParams", x => new { x.PropertyId, x.UserId });
                    table.ForeignKey(
                        name: "FK_PropertyParams_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PropertyParams_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PropertyParamsCommon",
                columns: table => new
                {
                    PropertyId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ListOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    ListDisplay = table.Column<bool>(type: "INTEGER", nullable: false),
                    ListWidth = table.Column<int>(type: "INTEGER", nullable: false),
                    ComplectOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    ComplectDisplay = table.Column<bool>(type: "INTEGER", nullable: false),
                    ComplectWidth = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyParamsCommon", x => x.PropertyId);
                    table.ForeignKey(
                        name: "FK_PropertyParamsCommon_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyParams_UserId",
                table: "PropertyParams",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyParams");

            migrationBuilder.DropTable(
                name: "PropertyParamsCommon");
        }
    }
}
