{ pkgs }: {
  deps = [
    pkgs.rubyPackages_3_0.sass
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server  
  ];
}