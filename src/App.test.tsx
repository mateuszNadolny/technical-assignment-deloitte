import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("Championship Day", () => {
	it("renders the page heading", () => {
		render(<App />);

		expect(
			screen.getByRole("heading", { level: 1, name: "Championship Day" }),
		).toBeInTheDocument();
	});

	it("shows every heat on the schedule", () => {
		render(<App />);

		expect(screen.getByText("Heat 1")).toBeInTheDocument();
		expect(screen.getByText("Heat 2")).toBeInTheDocument();
		expect(screen.getByText("Heat 3")).toBeInTheDocument();
	});

	it("shows finished sessions when Finished is chosen", async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole("button", { name: "Finished" }));

		expect(screen.getByText("Heat 2")).toBeInTheDocument();
		expect(screen.queryByText("Heat 1")).not.toBeInTheDocument();
	});

	it("reaches every filter with Tab and activates it with the keyboard", async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.tab();
		await user.tab();
		await user.tab();
		await user.tab();
		await user.tab();
		expect(screen.getByRole("button", { name: "Live only" })).toHaveFocus();

		await user.keyboard("{Enter}");
		expect(screen.getByText("Heat 1")).toBeInTheDocument();
		expect(screen.queryByText("Heat 2")).not.toBeInTheDocument();

		await user.tab();
		expect(screen.getByRole("button", { name: "All sessions" })).toHaveFocus();

		await user.keyboard(" ");
		expect(screen.getByText("Heat 2")).toBeInTheDocument();
		expect(screen.getByText("Heat 3")).toBeInTheDocument();
	});

	it("exposes the selected filter through aria-pressed", async () => {
		const user = userEvent.setup();
		render(<App />);

		expect(
			screen.getByRole("button", { name: "All sessions" }),
		).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByRole("button", { name: "Live only" })).toHaveAttribute(
			"aria-pressed",
			"false",
		);

		await user.click(screen.getByRole("button", { name: "Live only" }));

		expect(screen.getByRole("button", { name: "Live only" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(
			screen.getByRole("button", { name: "All sessions" }),
		).toHaveAttribute("aria-pressed", "false");
	});

	it("describes the course image for screen readers", () => {
		render(<App />);

		expect(
			screen.getByRole("img", {
				name: "Alpine skiing. Course: 58 gates, 180 m vertical drop.",
			}),
		).toBeInTheDocument();
	});

	it("toggles the favourite state under a stable name", async () => {
		const user = userEvent.setup();
		render(<App />);

		const favourite = screen.getByRole("button", { name: "Star favorite" });
		expect(favourite).toHaveAttribute("aria-pressed", "false");

		await user.click(favourite);
		expect(favourite).toHaveAttribute("aria-pressed", "true");

		await user.click(favourite);
		expect(favourite).toHaveAttribute("aria-pressed", "false");
	});

	it("shows a confirmation in a mounted status region when the share control is used", async () => {
		const user = userEvent.setup();
		render(<App />);

		const status = screen.getByRole("status");
		expect(status).toBeEmptyDOMElement();

		await user.click(screen.getByRole("button", { name: "Copy link" }));

		expect(status).toHaveTextContent("Link copied");
	});

	it("keeps only the active tab in the Tab order", async () => {
		const user = userEvent.setup();
		render(<App />);

		const tab = screen.getByRole("tab", { name: "Schedule" });
		expect(tab).toHaveAttribute("tabindex", "0");
		expect(screen.getByRole("tab", { name: "Results" })).toHaveAttribute(
			"tabindex",
			"-1",
		);

		await user.click(screen.getByRole("tab", { name: "Results" }));

		expect(screen.getByRole("tab", { name: "Results" })).toHaveAttribute(
			"tabindex",
			"0",
		);
		expect(screen.getByRole("tab", { name: "Schedule" })).toHaveAttribute(
			"tabindex",
			"-1",
		);
	});

	it("moves between views with the arrow keys, Home, and End", async () => {
		const user = userEvent.setup();
		render(<App />);

		screen.getByRole("tab", { name: "Schedule" }).focus();

		await user.keyboard("{ArrowRight}");
		expect(screen.getByRole("tab", { name: "Results" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(screen.getByText("Lena Berg")).toBeInTheDocument();

		await user.keyboard("{ArrowDown}");
		expect(screen.getByRole("tab", { name: "Medals" })).toHaveAttribute(
			"aria-selected",
			"true",
		);

		await user.keyboard("{ArrowUp}");
		expect(screen.getByRole("tab", { name: "Results" })).toHaveAttribute(
			"aria-selected",
			"true",
		);

		await user.keyboard("{ArrowLeft}");
		expect(screen.getByRole("tab", { name: "Schedule" })).toHaveAttribute(
			"aria-selected",
			"true",
		);

		await user.keyboard("{End}");
		expect(screen.getByRole("tab", { name: "Medals" })).toHaveAttribute(
			"aria-selected",
			"true",
		);

		await user.keyboard("{Home}");
		expect(screen.getByRole("tab", { name: "Schedule" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
	});

	it("shows each view in a named panel that follows the active tab", async () => {
		const user = userEvent.setup();
		render(<App />);

		const scheduleTab = screen.getByRole("tab", { name: "Schedule" });
		const schedulePanel = screen.getByRole("tabpanel", { name: "Schedule" });
		expect(schedulePanel).toBeVisible();
		expect(schedulePanel).toHaveAttribute(
			"id",
			scheduleTab.getAttribute("aria-controls"),
		);

		await user.click(screen.getByRole("tab", { name: "Results" }));

		const resultsPanel = screen.getByRole("tabpanel", { name: "Results" });
		expect(resultsPanel).toBeVisible();
		expect(resultsPanel).toHaveAttribute("tabindex", "0");
		expect(resultsPanel).toHaveAttribute(
			"id",
			screen
				.getByRole("tab", { name: "Results" })
				.getAttribute("aria-controls"),
		);
		expect(within(resultsPanel).getByText("Lena Berg")).toBeInTheDocument();

		await user.click(screen.getByRole("tab", { name: "Schedule" }));
		expect(schedulePanel).toBeVisible();
		expect(resultsPanel).not.toBeVisible();
	});

	it("opens a named dialog, starts on Heat changes, and restores focus on Close", async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole("button", { name: "Manage alerts" }));

		expect(
			screen.getByRole("dialog", { name: "Alert preferences" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("checkbox", { name: "Heat changes" }),
		).toHaveFocus();

		await user.click(screen.getByRole("button", { name: "Close" }));

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Manage alerts" })).toHaveFocus();
	});

	it("shows the heat detail when Details is activated", async () => {
		const user = userEvent.setup();
		render(<App />);

		const heatOneDetails = screen.getByRole("button", {
			name: "Details for Heat 1",
		});
		expect(heatOneDetails).toHaveAttribute("aria-expanded", "false");

		await user.click(heatOneDetails);

		expect(heatOneDetails).toHaveAttribute("aria-expanded", "true");
		expect(screen.getByText("First run starts at 10:15.")).toBeInTheDocument();
	});

	it("shows each athlete's standing as text", async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole("tab", { name: "Results" }));

		const lenaRow = screen.getByRole("row", { name: /Lena Berg/ });
		expect(within(lenaRow).getByText("Qualified")).toBeInTheDocument();
		const sofiaRow = screen.getByRole("row", { name: /Sofia Rossi/ });
		expect(within(sofiaRow).getByText("Eliminated")).toBeInTheDocument();
		expect(
			screen.getByRole("columnheader", { name: "Athlete" }),
		).toBeInTheDocument();
	});

	it("sorts by Bib with an exposed direction", async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole("tab", { name: "Results" }));

		await user.click(screen.getByRole("button", { name: "Sort by Bib" }));
		expect(screen.getByRole("columnheader", { name: /Bib/ })).toHaveAttribute(
			"aria-sort",
			"descending",
		);
		expect(screen.getAllByRole("row")[1]).toHaveTextContent("Hana Novak");

		await user.click(screen.getByRole("button", { name: "Sort by Bib" }));
		expect(screen.getByRole("columnheader", { name: /Bib/ })).toHaveAttribute(
			"aria-sort",
			"ascending",
		);
		expect(screen.getAllByRole("row")[1]).toHaveTextContent("Sofia Rossi");
	});
});
