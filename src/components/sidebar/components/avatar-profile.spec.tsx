import { render, screen, fireEvent } from "@testing-library/react";
import { AvatarProfile } from "./avatar-profile";

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span data-testid="avatar" className={className}>
      {children}
    </span>
  ),
  AvatarImage: ({
    src,
    alt,
    className,
  }: {
    src?: string;
    alt?: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="avatar-image" src={src} alt={alt} className={className} />
  ),
  AvatarFallback: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span data-testid="avatar-fallback" className={className}>
      {children}
    </span>
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

function createMockFile(name: string = "avatar.jpg") {
  return new File(["dummy"], name, { type: "image/jpeg" });
}

describe("AvatarProfile", () => {
  it("renders default avatar when no imageUrl is provided", () => {
    render(<AvatarProfile />);
    const img = screen.getByTestId("avatar-image") as HTMLImageElement;
    expect(img.src).toContain("/avatar.png");
  });

  it("renders provided imageUrl", () => {
    render(<AvatarProfile imageUrl="https://example.com/photo.jpg" />);
    const img = screen.getByTestId("avatar-image") as HTMLImageElement;
    expect(img.src).toContain("https://example.com/photo.jpg");
  });

  it("renders fallback text", () => {
    render(<AvatarProfile />);
    expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("CN");
  });

  it("renders camera label with title", () => {
    render(<AvatarProfile />);
    expect(screen.getByTitle("Alterar foto")).toBeInTheDocument();
  });

  it("hides camera label when disabled", () => {
    render(<AvatarProfile disabled />);
    const label = screen.getByTitle("Alterar foto");
    expect(label.className).toContain("hidden");
  });

  it("renders file input", () => {
    render(<AvatarProfile />);
    const input = document.getElementById("avatar-upload") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe("file");
    expect(input.accept).toBe("image/*");
  });

  it("calls onSelectFile when a file is selected", async () => {
    const onSelectFile = jest.fn();
    render(<AvatarProfile onSelectFile={onSelectFile} />);

    const file = createMockFile();
    const input = document.getElementById("avatar-upload") as HTMLInputElement;

    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(onSelectFile).toHaveBeenCalledTimes(1);
  });

  it("calls onSelectFile with null when no file is selected", () => {
    const onSelectFile = jest.fn();
    render(<AvatarProfile onSelectFile={onSelectFile} />);

    const input = document.getElementById("avatar-upload") as HTMLInputElement;

    Object.defineProperty(input, "files", { value: [] });
    fireEvent.change(input);

    expect(onSelectFile).toHaveBeenCalledWith(null, null);
  });

  it("disables file input when disabled is true", () => {
    render(<AvatarProfile disabled />);
    const input = document.getElementById("avatar-upload") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("updates preview when imageUrl prop changes", () => {
    const { rerender } = render(
      <AvatarProfile imageUrl="https://example.com/old.jpg" />,
    );
    const img = screen.getByTestId("avatar-image") as HTMLImageElement;
    expect(img.src).toContain("https://example.com/old.jpg");

    rerender(<AvatarProfile imageUrl="https://example.com/new.jpg" />);
    expect(img.src).toContain("https://example.com/new.jpg");
  });
});
