CREATE TABLE public.birthdays (
	user_id uuid NOT NULL,
	id int8 NOT NULL,
	"name" text NOT NULL,
	"month" int4 NOT NULL,
	"date" int4 NOT NULL,
	"year" int4 NULL,
	created_at timestamptz(0) NULL DEFAULT now(),
	CONSTRAINT birthdays_pk PRIMARY KEY (user_id, id)
);
CREATE INDEX birthdays_user_id_idx ON public.birthdays USING btree (user_id);