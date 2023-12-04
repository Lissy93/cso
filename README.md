
<h1 align="center">Chief Snack Officer</h1>
<p align="center">
  <i>Office snack requests, like never before!</i><br>
  <!-- <a align="center" href="https://cso.as93.net">🌐 <b>cso.as93.net</b></a><br /> -->
  <a href="https://snack-champion.as93.net">
    <img width="240" src="https://i.ibb.co/d43WK4Z/snack-champ-robot-transparent.png" />
  </a>
  <br>
</p>

> I built this in order to learn (the basics) of how to use Solid.js<br />
> And because for work, my job is to order in office snacks, and sending out surveys is boring.

<details open>
  <summary><h4>Contents</h4></summary>
  
- [About](#about)
- [Deployment](#deployment)
- [Config Options](#config-options)
- [Data Structures](#data-structures)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
</details>

## About

A platform for real-time requesting and voting on snacks for the office.
So that the fridge is always well stocked with food people actually love.

### Features
- View current, upcoming and past snack orders
- Request snacks
- Vote (up/down) on snacks
- View stats, like most loved, hated, controversial snacks
- SSO login, with access restricted by email domain
- Admin portal, where snack inventory can be managed

### Screenshots

https://github.com/Lissy93/cso/assets/1862727/a3fd8f11-3156-4c1e-8124-771ce2d872f2

<details>

  <summary>Screenshot</summary>

  <p align="center">
  <img width="700" src="https://i.ibb.co/xHbTtSF/snack-champion-home.png" />
  </p>
  
</details>


### Info

<details>
  <summary><b>Tech Stack</b></summary

Built using Solid.js <sup>[[1]](https://www.solidjs.com/)</sup> on the frontend (along with TS <sup>[[2]](https://www.typescriptlang.org/)</sup> and SCSS <sup>[[3]](https://sass-lang.com/)</sup>), tested with Jest <sup>[[4]](https://jestjs.io/)</sup>, bundled with Vite <sup>[[5]](https://vitejs.dev/)</sup>. The data is stored using a Postgress <sup>[[6]](https://www.postgresql.org/)</sup> DB via Supabase <sup>[[7]](https://supabase.com/)</sup>, with the frontend deployed to Netlify <sup>[[8]](https://www.netlify.com/)</sup> and the code hosted on GitHub <sup>[[9]](https://github.com)</sup> and CI/CD workflows managed with GH Actions<sup>[[10]](https://docs.github.com/en/actions)</sup>.

</details>

<details>
  <summary><b>Standards</b></summary

- **Configurable:** Set your companies name, branding and terminology
- **International:** No hard-coded copy, for easy language translations
- **Tested:** Fully unit tested with Jest, joined together with E2E
- **Documented:** In-code and MD docs, as well as strict typings for devs
- **Accessible:** Meets AA accessibility standards, so no one is left out
- **Performant:** Reactive, SSR, Caching
- **Responsive:** Mobile-first UI, optimized for a variety of devices
- **Secure:** Data is encrypted
- **Open Source:** All source code and docs are freely available on GitHub
- **Easy:** Super quick and simple to deploy your own instance on a range of architectures
- **Observable:** Easy monitoring, with errors tracked via GlitchTip and basic analytics via Plausible
- **Automated:** New releases are automatically tested and deployed by the CI/CD pipeline
- **SEO** SSR, meta
- **Compatible:** Consistent across all modern browser and devices, with fallback polyfills to support legacy environments
- **Privacy Respecting:** No invasive tracking, and the user can export or delete their data at any time
- **Neat:** Consistent coding standards are implemented with Prettier and ESLint 

</details>

<details>
  <summary><b>Future plans</b></summary
                                
I think it would be pretty fun to extend this, to automate as much of the process as possible. Based on snack ratings and user requests, use AI to generate a varied list of snacks that's within budget. Hook up to Slack to get approval from HR, use a supermarket API to make the order, generate the invoice and submit that to our companies expenses API, insert the arrival time into my calendar with Google API, and then collect employee snack feedback, and iterate for the next week.

That would basically be my whole job, automated.
  
</details>


---

## Deployment

To deploy the app, follow the [development instructions](#development) to get the code + dependencies, then run `yarn build` to build the production app, and use a web server of your choice to serve up the `/dist` directory.
You'll also need to deploy a Postgres DB, it's recommended to use Supabase. For setup instructions, see the [Data](#data-structures) section below.

The frontend can also be deployed to a static hosting provider of your choice. You can use the 1-click deploys below for Netlify or Vercel.

[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-%2330c8c9?style=for-the-badge&logo=netlify&labelColor=1e0e41 'Deploy CSO to Netlify, via 1-Click Script')](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/cso)

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-%23ffffff?style=for-the-badge&logo=vercel&labelColor=1e0e41)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLissy93%2Fcso&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY&envDescription=Login%20%2F%20create%20a%20Supabase%20account%2C%20then%20navigate%20to%20Settings%20--%3E%20API%20copy%20the%20URL%20and%20Anon%20API%20key%20&project-name=cso&repository-name=cso-fork)

Docker image coming soon...

<!-- Run `docker run -p 3000:3000 lissy93/cso`, then open [`localhost:3000`](http://localhost:3000)

<details>
<summary>Docker Options</summary>

You can get the Docker image from:
- DockerHub: [`lissy93/cso`](https://hub.docker.com/r/lissy93/cso)
- GHCR: [`ghcr.io/lissy93/cso`](https://github.com/Lissy93/cso/pkgs/container/web-check)
- Or build the image yourself by cloning the repo and running `docker build -t web-check .`

</details> -->


## Config Options

## Data Structures

<img src="https://github.com/Lissy93/cso/assets/1862727/866d2c52-685b-4a5d-ab96-f28b28194f3c" alt="schema class diagram" width="700" />


#### Snacks
```sql
create table
  public."Snacks" (
    snack_id uuid not null default gen_random_uuid (),
    snack_name character varying not null,
    user_id uuid null,
    created_at timestamp with time zone not null default now(),
    snack_category public.snack_category null,
    snack_meta json null,
    constraint Snacks2_pkey primary key (snack_id),
    constraint Snacks2_snack_name_key unique (snack_name),
    constraint Snacks_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete set null
  ) tablespace pg_default;
```

#### Votes
```sql
create table
  public."Votes" (
    vote_id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    snack_id uuid null,
    user_id uuid null,
    vote public.vote_type not null,
    constraint Votes_pkey primary key (vote_id),
    constraint Votes_snack_id_fkey foreign key (snack_id) references "Snacks" (snack_id),
    constraint Votes_user_id_fkey foreign key (user_id) references auth.users (id)
  ) tablespace pg_default;
```

#### Enums
```
snack_category: sweet, savory, healthy, drink	
vote_type: up, down
```

## Development

- `git clone git@github.com:Lissy93/cso.git && cd cso` - Grab the code
- `yarn install` - Install dependencies
- `cp .env.sample .env` - Then paste your Supabase URL and anon key
- `yarn dev` - Start the dev server. Then pop open [`localhost:5173`](http://localhost:5173)

You'll also need to create a Supabase project, and run the import script listed in [above](#data-structures).


## Contributing

Contributions of any kind are very welcome, and would be much appreciated.
For Code of Conduct, see [Contributor Convent](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

To get started, fork the repo, follow the [development](#development) steps above, add, commit and push the code, then come back here to open a pull request. If you're new to GitHub or open source, I have some guides in [Lissy93/git-into-open-source](https://github.com/Lissy93/git-into-open-source/) which might help - but feel free to ask if you need any help.

## License

> _**[Lissy93/CSO](https://github.com/Lissy93/cso)** is licensed under [MIT](https://github.com/Lissy93/cso/blob/HEAD/LICENSE) © [Alicia Sykes](https://aliciasykes.com) 2023._<br>
> <sup align="right">For information, see <a href="https://tldrlegal.com/license/mit-license">TLDR Legal > MIT</a></sup>

<details>
<summary>Expand License</summary>

```
The MIT License (MIT)
Copyright (c) Alicia Sykes <alicia@omg.com> 

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sub-license, and/or sell 
copies of the Software, and to permit persons to whom the Software is furnished 
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included install 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANT ABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

</details>


<!-- License + Copyright -->
<p  align="center">
  <i>© <a href="https://aliciasykes.com">Alicia Sykes</a> 2023</i><br>
  <i>Licensed under <a href="https://gist.github.com/Lissy93/143d2ee01ccc5c052a17">MIT</a></i><br>
  <a href="https://github.com/lissy93"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" /></a><br>
  <sup>Thanks for visiting :)</sup>
</p>

<!-- Dinosaurs are Awesome -->
<!-- 
                        . - ~ ~ ~ - .
      ..     _      .-~               ~-.
     //|     \ `..~                      `.
    || |      }  }              /       \  \
(\   \\ \~^..'                 |         }  \
 \`.-~  o      /       }       |        /    \
 (__          |       /        |       /      `.
  `- - ~ ~ -._|      /_ - ~ ~ ^|      /- _      `.
              |     /          |     /     ~-.     ~- _
              |_____|          |_____|         ~ - . _ _~_-_
-->

