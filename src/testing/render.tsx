import { render } from "@testing-library/react";
import { ReactNode } from "react";
import React from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { vi } from "vitest";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider/next-13.5";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@clerk/nextjs", async () => {
  const actual =
    await vi.importActual<typeof import("@clerk/nextjs")>("@clerk/nextjs");
  return {
    ...actual,
    useAuth: vi.fn(() => ({ userId: "test-user" })),
    SignIn: () => <div data-testid="clerk-sign-in">Sign In Component</div>,
    ClerkProvider: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

const ClerkTestProvider = ({
  isLoggedIn = false,
  children,
}: {
  isLoggedIn?: boolean;
  children: ReactNode;
}) => {
  (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    userId: isLoggedIn ? "user-id" : null,
  });

  // Here, we wrap our component in the ClerkProvider and MemoryRouterProvider to provide the necessary context for our tests.
  // MemoryRouterProvider is used to mock the Next.js router,
  // which is necessary for testing components that use the router.
  return (
    <MemoryRouterProvider>
      <ClerkProvider>{children}</ClerkProvider>
    </MemoryRouterProvider>
  );
};

const createWrapper = (ui: React.ReactElement) => (
  <ClerkTestProvider>
      <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
  </ClerkTestProvider>
);

export const renderWithProviders = (ui: React.ReactElement) => {
  const rendered = render(createWrapper(ui));
  return {
    ...rendered,
    rerender: (ui: React.ReactElement) => rendered.rerender(createWrapper(ui)),
  };
};
