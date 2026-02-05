using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PGFinder2.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingPGProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AvailableRooms",
                table: "PGs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AvailableSlots",
                table: "PGs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "PGs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "PGs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "PGs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "PGs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PGType",
                table: "PGs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Pincode",
                table: "PGs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "PGs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TotalRooms",
                table: "PGs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableRooms",
                table: "PGs");

            migrationBuilder.DropColumn(
                name: "AvailableSlots",
                table: "PGs");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "PGs");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "PGs");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "PGs");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "PGs");

            migrationBuilder.DropColumn(
                name: "PGType",
                table: "PGs");

            migrationBuilder.DropColumn(
                name: "Pincode",
                table: "PGs");

            migrationBuilder.DropColumn(
                name: "State",
                table: "PGs");

            migrationBuilder.DropColumn(
                name: "TotalRooms",
                table: "PGs");
        }
    }
}
