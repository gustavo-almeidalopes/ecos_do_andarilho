# 🎮 Ecos do Andarilho — Landing Page & Jogo

> **Projeto Académico** — Desenvolvido para a disciplina de Desenvolvimento Mobile  
> Engine utilizada: **Construct 3** | Landing Page: **HTML · CSS · JavaScript**

<div align="center">

![Badge](https://img.shields.io/badge/Engine-Construct%203-orange?style=for-the-badge)
![Badge](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen?style=for-the-badge)
![Badge](https://img.shields.io/badge/Plataforma-Web%20%2F%20HTML5-blue?style=for-the-badge)
![Badge](https://img.shields.io/badge/Licen%C3%A7a-MIT-lightgrey?style=for-the-badge)

</div>

---

## 📖 Sobre o Projeto

**Ecos do Andarilho** é um jogo de plataformas e ritmo desenvolvido integralmente na engine **Construct 3** como trabalho académico universitário. O jogador sincroniza seus saltos com a música e derrota inimigos no tempo certo, explorando um mundo vibrante e colorido.

Este repositório contém:
- 🎮 **O jogo exportado em HTML5** — jogável diretamente no navegador
- 🌐 **A Landing Page oficial** — desenvolvida em HTML, CSS e JavaScript puro, com design Neo-Retro e animações premium

---

## ✨ Funcionalidades do Jogo

| Funcionalidade | Descrição |
|---|---|
| 🎵 Gameplay Rítmico | Sincronização dos saltos e inimigos com a batida da música |
| 🏃 Física Custom | Sistema de *Gravity* e *Jump Strength* ajustados manualmente |
| 🗺️ 4 Mapas | Floresta, Ruínas, Nuvens e Covil do Chefe |
| 👾 3 Heróis | Kaelen, Lyra e Grom — cada um com mecânicas únicas |
| 📱 Suporte Mobile | Controles por toque via *Touch Plugin* do Construct 3 |
| 🛡️ Sistema de Shield | Variável booleana que absorve golpes (personagem Grom) |
| ⚡ Ecos | Momentos onde a batida da música dita as variáveis globais |

---

## 🗂️ Estrutura do Repositório

```
jogo_aula_de_mobile/
│
├── index.html              # Landing Page principal
├── README.md               # Este arquivo
├── LICENSE                 # Licença MIT
│
├── css/
│   └── style.css           # Estilos da Landing Page (design Neo-Retro)
│
├── js/
│   └── script.js           # Lógica: animações GSAP, Anime.js, parallax, easter eggs
│
├── images/
│   ├── chars/              # Sprites dos personagens (pixel art)
│   │   ├── personagem1.png # Kaelen — O Salteador
│   │   ├── personagem2.png # Lyra — Tecelã das Nuvens
│   │   └── personagem3.png # Grom — O Guardião de Pedra
│   ├── devs/               # Fotos/avatares dos desenvolvedores
│   │   ├── developer_site.png
│   │   └── developer_game.png
│   └── ui/                 # Assets de interface
│       ├── capa.png        # Capa do projeto
│       ├── imagem1_cenario.png
│       └── favicon.ico
│
└── game/                   # Export do jogo em HTML5 (Construct 3)
    └── jogo.html
```

---

## 🎨 Stack da Landing Page

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica da página |
| **CSS3 Vanilla** | Sistema de design com variáveis CSS, glassmorphism, layout responsivo |
| **JavaScript ES6+** | Lógica de animações, interatividade e easter eggs |
| **GSAP 3.12** + **ScrollTrigger** | Animações de scroll, parallax vertical e pin horizontal |
| **Anime.js 3.2** | Animações de entrada, partículas e efeitos magnéticos nos botões |
| **Google Fonts** | Press Start 2P (pixel font) + Inter |

### Design System

- 🎨 Paleta Neo-Retro: Céu Azul, Grama Verde, Pedra, Madeira e Vermelho
- 🖌️ Tipografia pixel art com `Press Start 2P`
- 🪟 Glassmorphism na navegação flutuante
- ✨ Micro-animações em todos os elementos interativos
- 📱 Layout 100% responsivo com `clamp()` e media queries

---

## 🕹️ Como Executar

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Nenhuma dependência de instalação — tudo via CDN

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/gustavo-almeidalopes/jogo_aula_de_mobile.git
   cd jogo_aula_de_mobile
   ```

2. **Abra a Landing Page:**
   - Abra `index.html` diretamente no navegador, **ou**
   - Use uma extensão como **Live Server** no VS Code para hot reload

3. **Jogar:**
   - Clique em **"JOGAR NO BROWSER"** na Landing Page
   - Ou acesse `game/jogo.html` diretamente

---

## 🗺️ Mapas do Jogo

| Mapa | Tema | Mecânica Principal |
|---|---|---|
| 🌳 **Mapa 1 — A Floresta** | Introdutório | Controles básicos, primeiros inimigos |
| 🏛️ **Mapa 2 — Ruínas** | Exploração vertical | Behavior *Jump-thru* em plataformas |
| ☁️ **Mapa 3 — Nuvens** | Precisão | Plataformas móveis com behavior *Sine* |
| 🔥 **Mapa 4 — Covil** | Boss final | Ritmo acelerado, perigos responsivos à música |

---

## 🦸 Os Heróis

### Kaelen — O Salteador
> *"Saltar em cima dos inimigos no ritmo certo? Deixa comigo!"*

Personagem base focado na mecânica do *Platformer* clássico. A programação exigiu ajuste fino das variáveis de **Gravity** e **Jump Strength**.

### Lyra — Tecelã das Nuvens
> *"O vento sopra sempre no andamento perfeito da música."*

Personagem alternativo que manipula as leis da física da engine. Sua habilidade especial anula temporariamente a gravidade (`Set Gravity to 0`).

### Grom — O Guardião de Pedra
> *"As montanhas não recuam e eu também não!"*

O "Tank" do grupo. Possui uma variável booleana de **Shield** que absorve um golpe. Quando danificado, a *Animation* transita para um estado enfraquecido.

---

## 📅 Fases do Desenvolvimento

```
✅ FASE 1 — Conceito e GDD
   Paleta de cores, sprites iniciais e validação da lógica de ritmo

✅ FASE 2 — Protótipo no Construct 3
   Behaviors nativos (Platform, Solid, Sine), Folhas de Eventos e testes de colisão

✅ FASE 3 — Entrega & Polimento
   Adição de som, correção de bugs (QA), exportação HTML5 e criação da Landing Page

🔜 FASE 4 — Apresentação
   Submissão formal, defesa oral e demonstração ao vivo
```

---

## 👩‍💻 Equipe

<table>
  <tr>
    <td align="center">
      <b>Gustavo Lopes</b><br/>
      <sub>RGM: 34283008</sub><br/>
      <sub>UX/UI Designer & Front-end Dev</sub>
    </td>
    <td align="center">
      <b>Erick Oliveira</b><br/>
      <sub>RGM: 40277704</sub><br/>
      <sub>Desenvolvedor do Jogo (Construct 3)</sub>
    </td>
  </tr>
</table>

**Gustavo Lopes** — Responsável pela Landing Page oficial, focando em responsividade, acessibilidade e performance. Estruturou o front-end com HTML, CSS e JavaScript usando design Neo-Retro. Liderou o versionamento de código e elaborou a documentação técnica do projeto.

**Erick Oliveira** — Engenheiro principal do jogo. Criou e configurou os mapas, desenvolveu os sistemas de física, movimentação e animação de sprites, garantindo performance consistente e livre de quedas de frame rate.

---

## 🔗 Links

- 🌐 **Landing Page ao vivo:** *(abrir `index.html`)*
- 🎮 **Jogo ao vivo:** *(abrir `game/jogo.html`)*
- 📁 **Repositório:** [github.com/gustavo-almeidalopes/jogo_aula_de_mobile](https://github.com/gustavo-almeidalopes/jogo_aula_de_mobile)

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** — veja o arquivo [LICENSE](LICENSE) para detalhes.

> ⚠️ *"Ecos do Andarilho" é estritamente um projeto académico desenvolvido para fins educacionais. Não há fins comerciais.*

---

<div align="center">
  <sub>© 2026 Ecos do Andarilho — Trabalho Académico desenvolvido no Construct 3</sub><br/>
  <sub>💡 <i>Dica: Existem moedas escondidas pela Landing Page. Consegue encontrá-las?</i></sub>
</div>